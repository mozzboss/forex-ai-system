//+------------------------------------------------------------------+
//|  ForexAI_Bridge.mq5                                              |
//|  Pushes open + recently closed MT5 positions to Forex AI System  |
//|  Install: MT5 → File → Open Data Folder → MQL5 → Experts         |
//+------------------------------------------------------------------+
#property copyright "Forex AI System"
#property version   "1.0"
#property strict

//── Inputs ──────────────────────────────────────────────────────────
input string API_URL       = "https://forex-ai-system.vercel.app/api/mt/import"; // Your Vercel URL
input string ACCOUNT_NAME  = "";          // Must match account name in Forex AI System
input int    SYNC_INTERVAL = 30;          // Seconds between syncs
input bool   SYNC_CLOSED   = true;        // Also sync trades closed today
input bool   LOG_REQUESTS  = true;        // Print request/response to Experts log

//── Globals ─────────────────────────────────────────────────────────
datetime g_lastSync = 0;

//+------------------------------------------------------------------+
int OnInit() {
   Print("[ForexAI] Bridge started. Syncing to: ", API_URL);
   Print("[ForexAI] Account name: ", (ACCOUNT_NAME == "" ? AccountInfoString(ACCOUNT_INFO_NAME) : ACCOUNT_NAME));
   EventSetTimer(SYNC_INTERVAL);
   SyncPositions(); // Sync immediately on attach
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason) {
   EventKillTimer();
   Print("[ForexAI] Bridge stopped.");
}

void OnTimer() {
   SyncPositions();
}

//+------------------------------------------------------------------+
//  Build JSON payload and POST to API                               |
//+------------------------------------------------------------------+
void SyncPositions() {
   string acctName = (ACCOUNT_NAME == "" ? AccountInfoString(ACCOUNT_INFO_NAME) : ACCOUNT_NAME);
   string json     = "[";
   bool   first    = true;

   // ── Open positions ──────────────────────────────────────────────
   int total = PositionsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (!PositionSelectByTicket(ticket)) continue;

      string ref    = "MT5-" + IntegerToString((long)ticket);
      string pair   = PositionGetString(POSITION_SYMBOL);
      string dir    = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? "LONG" : "SHORT";
      double entry  = PositionGetDouble(POSITION_PRICE_OPEN);
      double sl     = PositionGetDouble(POSITION_SL);
      double tp     = PositionGetDouble(POSITION_TP);
      double lots   = PositionGetDouble(POSITION_VOLUME);
      double pnl    = PositionGetDouble(POSITION_PROFIT);
      datetime openTime = (datetime)PositionGetInteger(POSITION_TIME);

      if (!first) json += ",";
      json += BuildPositionJson(ref, acctName, pair, dir, "open", entry, sl, tp, lots,
                                TimeToString(openTime, TIME_DATE|TIME_SECONDS), "", pnl, 0, "");
      first = false;
   }

   // ── Closed trades from today ─────────────────────────────────────
   if (SYNC_CLOSED) {
      datetime todayStart = StringToTime(TimeToString(TimeCurrent(), TIME_DATE));
      HistorySelect(todayStart, TimeCurrent());
      int deals = HistoryDealsTotal();

      for (int i = 0; i < deals; i++) {
         ulong ticket = HistoryDealGetTicket(i);
         if (HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;

         long orderTicket = HistoryDealGetInteger(ticket, DEAL_ORDER);
         string ref       = "MT5-CLOSE-" + IntegerToString(orderTicket);
         string pair      = HistoryDealGetString(ticket, DEAL_SYMBOL);
         long type        = HistoryDealGetInteger(ticket, DEAL_TYPE);
         // Closing a BUY = was SHORT entry; closing a SELL = was LONG entry
         string dir       = (type == DEAL_TYPE_SELL) ? "LONG" : "SHORT";
         double entry     = HistoryDealGetDouble(ticket, DEAL_PRICE);
         double lots      = HistoryDealGetDouble(ticket, DEAL_VOLUME);
         double pnl       = HistoryDealGetDouble(ticket, DEAL_PROFIT);
         datetime closeTime = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);

         if (!first) json += ",";
         json += BuildPositionJson(ref, acctName, pair, dir, "closed", entry, 0, 0, lots,
                                   "", TimeToString(closeTime, TIME_DATE|TIME_SECONDS), pnl, 0, "");
         first = false;
      }
   }

   json += "]";

   if (json == "[]") {
      if (LOG_REQUESTS) Print("[ForexAI] No positions to sync.");
      return;
   }

   string payload = "{\"positions\":" + json + "}";
   PostToApi(payload);
   g_lastSync = TimeCurrent();
}

//+------------------------------------------------------------------+
string BuildPositionJson(
   string ref, string acctName, string pair, string dir, string status,
   double entry, double sl, double tp, double lots,
   string openedAt, string closedAt, double pnl, double pipsPnl, string notes
) {
   // Normalise pair: remove broker suffix (e.g. EURUSDm → EURUSD)
   pair = NormalisePair(pair);

   string j = "{";
   j += "\"externalRef\":\"" + ref + "\",";
   j += "\"accountName\":\"" + acctName + "\",";
   j += "\"pair\":\"" + pair + "\",";
   j += "\"direction\":\"" + dir + "\",";
   j += "\"status\":\"" + status + "\",";
   j += "\"entryPrice\":" + DoubleToString(entry, 5) + ",";
   j += "\"stopLoss\":" + DoubleToString(sl, 5) + ",";
   j += "\"takeProfit\":" + DoubleToString(tp, 5) + ",";
   j += "\"lotSize\":" + DoubleToString(lots, 2) + ",";
   j += "\"pnl\":" + DoubleToString(pnl, 2) + ",";
   j += "\"pipsPnl\":" + DoubleToString(pipsPnl, 1);
   if (openedAt != "") j += ",\"openedAt\":\"" + openedAt + "\"";
   if (closedAt != "") j += ",\"closedAt\":\"" + closedAt + "\"";
   if (notes    != "") j += ",\"notes\":\"" + notes + "\"";
   j += "}";
   return j;
}

//+------------------------------------------------------------------+
string NormalisePair(string symbol) {
   string pairs[] = {
      "EURUSD","GBPUSD","AUDUSD","NZDUSD","USDCAD","USDCHF","USDJPY","XAUUSD",
      "EURGBP","EURJPY","GBPJPY","AUDJPY","CADJPY","CHFJPY","EURAUD","EURCHF",
      "EURCAD","GBPAUD","GBPCAD","GBPCHF","AUDCAD","AUDCHF","AUDNZD","NZDJPY"
   };
   string upper = symbol;
   StringToUpper(upper);
   for (int i = 0; i < ArraySize(pairs); i++) {
      if (StringFind(upper, pairs[i]) >= 0) return pairs[i];
   }
   // Strip trailing suffix (m, c, pro, etc) — return first 6 chars if no match
   if (StringLen(upper) >= 6) return StringSubstr(upper, 0, 6);
   return upper;
}

//+------------------------------------------------------------------+
void PostToApi(string payload) {
   if (LOG_REQUESTS) {
      Print("[ForexAI] POST → ", API_URL);
      Print("[ForexAI] Payload: ", StringSubstr(payload, 0, 300));
   }

   char   body[];
   char   result[];
   string headers  = "Content-Type: application/json\r\n";
   string response = "";
   int    timeout  = 10000;

   StringToCharArray(payload, body, 0, StringLen(payload));
   ArrayResize(body, ArraySize(body) - 1); // Remove null terminator

   int httpCode = WebRequest("POST", API_URL, headers, timeout, body, result, response);

   if (httpCode == -1) {
      Print("[ForexAI] WebRequest failed. Add ", API_URL, " to: Tools → Options → Expert Advisors → Allow WebRequest");
   } else if (httpCode == 200 || httpCode == 201) {
      Print("[ForexAI] Sync OK (", httpCode, "). Response: ", CharArrayToString(result, 0, MathMin(200, ArraySize(result))));
   } else {
      Print("[ForexAI] Sync failed (HTTP ", httpCode, "): ", CharArrayToString(result, 0, MathMin(400, ArraySize(result))));
   }
}
//+------------------------------------------------------------------+
