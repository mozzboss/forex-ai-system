//+------------------------------------------------------------------+
//|  ForexAI_Bridge.mq5                                              |
//|  Pushes open + recently closed MT5 positions to Forex AI System  |
//|  Install: MT5 → MetaEditor → compile → attach to any chart       |
//+------------------------------------------------------------------+
#property copyright "Forex AI System"
#property version   "1.00"
#property strict

//── Inputs ──────────────────────────────────────────────────────────
input string InpApiUrl       = "https://forex-ai-system.vercel.app/api/mt/import";
input string InpAccountName  = "";    // Must match account name in Forex AI System
input int    InpSyncInterval = 30;    // Seconds between syncs
input bool   InpSyncClosed   = true;  // Also sync trades closed today
input bool   InpLogRequests  = true;  // Print to Experts log

//── Globals ─────────────────────────────────────────────────────────
datetime g_lastSync = 0;

//+------------------------------------------------------------------+
int OnInit()
  {
   Print("[ForexAI] Bridge started. URL: ", InpApiUrl);
   EventSetTimer(InpSyncInterval);
   SyncPositions();
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   EventKillTimer();
   Print("[ForexAI] Bridge stopped.");
  }

//+------------------------------------------------------------------+
void OnTimer()
  {
   SyncPositions();
  }

//+------------------------------------------------------------------+
void SyncPositions()
  {
   string acctName = (InpAccountName == "") ? AccountInfoString(ACCOUNT_NAME) : InpAccountName;
   string json     = "[";
   bool   first    = true;

   //── Open positions ──────────────────────────────────────────────
   int total = PositionsTotal();
   for(int i = 0; i < total; i++)
     {
      ulong ticket = PositionGetTicket(i);
      if(!PositionSelectByTicket(ticket))
         continue;

      string ref      = "MT5-" + IntegerToString((long)ticket);
      string pair     = NormalisePair(PositionGetString(POSITION_SYMBOL));
      string dir      = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? "LONG" : "SHORT";
      double entry    = PositionGetDouble(POSITION_PRICE_OPEN);
      double sl       = PositionGetDouble(POSITION_SL);
      double tp       = PositionGetDouble(POSITION_TP);
      double lots     = PositionGetDouble(POSITION_VOLUME);
      double pnl      = PositionGetDouble(POSITION_PROFIT);
      datetime opened = (datetime)PositionGetInteger(POSITION_TIME);

      if(!first) json += ",";
      json += MakeJson(ref, acctName, pair, dir, "open", entry, sl, tp, lots,
                       TimeToString(opened, TIME_DATE|TIME_SECONDS), "", pnl);
      first = false;
     }

   //── Closed trades from today ────────────────────────────────────
   if(InpSyncClosed)
     {
      datetime todayStart = StringToTime(TimeToString(TimeCurrent(), TIME_DATE));
      HistorySelect(todayStart, TimeCurrent());
      int deals = HistoryDealsTotal();

      for(int i = 0; i < deals; i++)
        {
         ulong ticket = HistoryDealGetTicket(i);
         if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT)
            continue;

         long   orderTkt  = HistoryDealGetInteger(ticket, DEAL_ORDER);
         string ref       = "MT5-C-" + IntegerToString(orderTkt);
         string pair      = NormalisePair(HistoryDealGetString(ticket, DEAL_SYMBOL));
         long   dealType  = HistoryDealGetInteger(ticket, DEAL_TYPE);
         string dir       = (dealType == DEAL_TYPE_SELL) ? "LONG" : "SHORT";
         double entry     = HistoryDealGetDouble(ticket, DEAL_PRICE);
         double lots      = HistoryDealGetDouble(ticket, DEAL_VOLUME);
         double pnl       = HistoryDealGetDouble(ticket, DEAL_PROFIT);
         datetime closed  = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);

         if(!first) json += ",";
         json += MakeJson(ref, acctName, pair, dir, "closed", entry, 0, 0, lots,
                          "", TimeToString(closed, TIME_DATE|TIME_SECONDS), pnl);
         first = false;
        }
     }

   json += "]";

   if(json == "[]")
     {
      if(InpLogRequests) Print("[ForexAI] Nothing to sync.");
      return;
     }

   string payload = "{\"positions\":" + json + "}";
   PostToApi(payload);
  }

//+------------------------------------------------------------------+
string MakeJson(string ref, string acct, string pair, string dir, string status,
                double entry, double sl, double tp, double lots,
                string openedAt, string closedAt, double pnl)
  {
   string j = "{";
   j += "\"externalRef\":\"" + ref + "\",";
   j += "\"accountName\":\"" + acct + "\",";
   j += "\"pair\":\"" + pair + "\",";
   j += "\"direction\":\"" + dir + "\",";
   j += "\"status\":\"" + status + "\",";
   j += "\"entryPrice\":" + DoubleToString(entry, 5) + ",";
   j += "\"stopLoss\":" + DoubleToString(sl, 5) + ",";
   j += "\"takeProfit\":" + DoubleToString(tp, 5) + ",";
   j += "\"lotSize\":" + DoubleToString(lots, 2) + ",";
   j += "\"pnl\":" + DoubleToString(pnl, 2);
   if(openedAt != "") j += ",\"openedAt\":\"" + openedAt + "\"";
   if(closedAt != "") j += ",\"closedAt\":\"" + closedAt + "\"";
   j += "}";
   return(j);
  }

//+------------------------------------------------------------------+
string NormalisePair(string symbol)
  {
   string pairs[] = {
      "EURUSD","GBPUSD","AUDUSD","NZDUSD","USDCAD","USDCHF","USDJPY","XAUUSD",
      "EURGBP","EURJPY","GBPJPY","AUDJPY","CADJPY","CHFJPY","EURAUD","EURCHF",
      "EURCAD","GBPAUD","GBPCAD","GBPCHF","AUDCAD","AUDCHF","AUDNZD","NZDJPY"
   };
   string up = symbol;
   StringToUpper(up);
   for(int i = 0; i < ArraySize(pairs); i++)
     {
      if(StringFind(up, pairs[i]) >= 0) return(pairs[i]);
     }
   if(StringLen(up) >= 6) return(StringSubstr(up, 0, 6));
   return(up);
  }

//+------------------------------------------------------------------+
void PostToApi(string payload)
  {
   if(InpLogRequests)
     {
      Print("[ForexAI] POST ", InpApiUrl);
      Print("[ForexAI] ", StringSubstr(payload, 0, 300));
     }

   char   body[];
   char   result[];
   string resultHeaders = "";
   string headers       = "Content-Type: application/json\r\n";

   int len = StringToCharArray(payload, body, 0, WHOLE_ARRAY, CP_UTF8) - 1;
   if(len <= 0) return;
   ArrayResize(body, len);

   int code = WebRequest("POST", InpApiUrl, headers, 10000, body, result, resultHeaders);

   if(code == -1)
     {
      Print("[ForexAI] ERROR: WebRequest failed. Go to MT5 → Tools → Options → Expert Advisors");
      Print("[ForexAI] → Check 'Allow WebRequest' → Add URL: ", InpApiUrl);
     }
   else if(code == 200 || code == 201)
     {
      Print("[ForexAI] Sync OK (", code, ")");
     }
   else
     {
      Print("[ForexAI] Sync failed (HTTP ", code, "): ",
            CharArrayToString(result, 0, MathMin(300, ArraySize(result))));
     }
  }
//+------------------------------------------------------------------+
