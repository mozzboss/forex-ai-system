
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model TradingAccount
 * 
 */
export type TradingAccount = $Result.DefaultSelection<Prisma.$TradingAccountPayload>
/**
 * Model Trade
 * 
 */
export type Trade = $Result.DefaultSelection<Prisma.$TradePayload>
/**
 * Model JournalEntry
 * 
 */
export type JournalEntry = $Result.DefaultSelection<Prisma.$JournalEntryPayload>
/**
 * Model DailyPlan
 * 
 */
export type DailyPlan = $Result.DefaultSelection<Prisma.$DailyPlanPayload>
/**
 * Model NewsEvent
 * 
 */
export type NewsEvent = $Result.DefaultSelection<Prisma.$NewsEventPayload>
/**
 * Model AlertLog
 * 
 */
export type AlertLog = $Result.DefaultSelection<Prisma.$AlertLogPayload>
/**
 * Model AnalysisCache
 * 
 */
export type AnalysisCache = $Result.DefaultSelection<Prisma.$AnalysisCachePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AccountMode: {
  funded: 'funded',
  personal: 'personal'
};

export type AccountMode = (typeof AccountMode)[keyof typeof AccountMode]


export const TradeDirection: {
  LONG: 'LONG',
  SHORT: 'SHORT'
};

export type TradeDirection = (typeof TradeDirection)[keyof typeof TradeDirection]


export const SetupType: {
  pullback: 'pullback',
  breakout: 'breakout',
  reversal: 'reversal',
  liquidity_sweep: 'liquidity_sweep'
};

export type SetupType = (typeof SetupType)[keyof typeof SetupType]


export const TradeStatus: {
  pending: 'pending',
  open: 'open',
  closed: 'closed',
  cancelled: 'cancelled',
  denied: 'denied'
};

export type TradeStatus = (typeof TradeStatus)[keyof typeof TradeStatus]


export const EntryStatus: {
  WAIT: 'WAIT',
  READY: 'READY',
  CONFIRMED: 'CONFIRMED',
  INVALID: 'INVALID'
};

export type EntryStatus = (typeof EntryStatus)[keyof typeof EntryStatus]


export const JournalEntryType: {
  trade: 'trade',
  review: 'review',
  lesson: 'lesson',
  plan: 'plan'
};

export type JournalEntryType = (typeof JournalEntryType)[keyof typeof JournalEntryType]


export const NewsImpact: {
  low: 'low',
  medium: 'medium',
  high: 'high'
};

export type NewsImpact = (typeof NewsImpact)[keyof typeof NewsImpact]

}

export type AccountMode = $Enums.AccountMode

export const AccountMode: typeof $Enums.AccountMode

export type TradeDirection = $Enums.TradeDirection

export const TradeDirection: typeof $Enums.TradeDirection

export type SetupType = $Enums.SetupType

export const SetupType: typeof $Enums.SetupType

export type TradeStatus = $Enums.TradeStatus

export const TradeStatus: typeof $Enums.TradeStatus

export type EntryStatus = $Enums.EntryStatus

export const EntryStatus: typeof $Enums.EntryStatus

export type JournalEntryType = $Enums.JournalEntryType

export const JournalEntryType: typeof $Enums.JournalEntryType

export type NewsImpact = $Enums.NewsImpact

export const NewsImpact: typeof $Enums.NewsImpact

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.tradingAccount`: Exposes CRUD operations for the **TradingAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingAccounts
    * const tradingAccounts = await prisma.tradingAccount.findMany()
    * ```
    */
  get tradingAccount(): Prisma.TradingAccountDelegate<ExtArgs>;

  /**
   * `prisma.trade`: Exposes CRUD operations for the **Trade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trades
    * const trades = await prisma.trade.findMany()
    * ```
    */
  get trade(): Prisma.TradeDelegate<ExtArgs>;

  /**
   * `prisma.journalEntry`: Exposes CRUD operations for the **JournalEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JournalEntries
    * const journalEntries = await prisma.journalEntry.findMany()
    * ```
    */
  get journalEntry(): Prisma.JournalEntryDelegate<ExtArgs>;

  /**
   * `prisma.dailyPlan`: Exposes CRUD operations for the **DailyPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyPlans
    * const dailyPlans = await prisma.dailyPlan.findMany()
    * ```
    */
  get dailyPlan(): Prisma.DailyPlanDelegate<ExtArgs>;

  /**
   * `prisma.newsEvent`: Exposes CRUD operations for the **NewsEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsEvents
    * const newsEvents = await prisma.newsEvent.findMany()
    * ```
    */
  get newsEvent(): Prisma.NewsEventDelegate<ExtArgs>;

  /**
   * `prisma.alertLog`: Exposes CRUD operations for the **AlertLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlertLogs
    * const alertLogs = await prisma.alertLog.findMany()
    * ```
    */
  get alertLog(): Prisma.AlertLogDelegate<ExtArgs>;

  /**
   * `prisma.analysisCache`: Exposes CRUD operations for the **AnalysisCache** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisCaches
    * const analysisCaches = await prisma.analysisCache.findMany()
    * ```
    */
  get analysisCache(): Prisma.AnalysisCacheDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    TradingAccount: 'TradingAccount',
    Trade: 'Trade',
    JournalEntry: 'JournalEntry',
    DailyPlan: 'DailyPlan',
    NewsEvent: 'NewsEvent',
    AlertLog: 'AlertLog',
    AnalysisCache: 'AnalysisCache'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "tradingAccount" | "trade" | "journalEntry" | "dailyPlan" | "newsEvent" | "alertLog" | "analysisCache"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      TradingAccount: {
        payload: Prisma.$TradingAccountPayload<ExtArgs>
        fields: Prisma.TradingAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          findFirst: {
            args: Prisma.TradingAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          findMany: {
            args: Prisma.TradingAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>[]
          }
          create: {
            args: Prisma.TradingAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          createMany: {
            args: Prisma.TradingAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>[]
          }
          delete: {
            args: Prisma.TradingAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          update: {
            args: Prisma.TradingAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          deleteMany: {
            args: Prisma.TradingAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TradingAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          aggregate: {
            args: Prisma.TradingAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingAccount>
          }
          groupBy: {
            args: Prisma.TradingAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingAccountCountArgs<ExtArgs>
            result: $Utils.Optional<TradingAccountCountAggregateOutputType> | number
          }
        }
      }
      Trade: {
        payload: Prisma.$TradePayload<ExtArgs>
        fields: Prisma.TradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findFirst: {
            args: Prisma.TradeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findMany: {
            args: Prisma.TradeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          create: {
            args: Prisma.TradeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          createMany: {
            args: Prisma.TradeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          delete: {
            args: Prisma.TradeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          update: {
            args: Prisma.TradeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          deleteMany: {
            args: Prisma.TradeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TradeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          aggregate: {
            args: Prisma.TradeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrade>
          }
          groupBy: {
            args: Prisma.TradeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeCountArgs<ExtArgs>
            result: $Utils.Optional<TradeCountAggregateOutputType> | number
          }
        }
      }
      JournalEntry: {
        payload: Prisma.$JournalEntryPayload<ExtArgs>
        fields: Prisma.JournalEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JournalEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JournalEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findFirst: {
            args: Prisma.JournalEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JournalEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          findMany: {
            args: Prisma.JournalEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          create: {
            args: Prisma.JournalEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          createMany: {
            args: Prisma.JournalEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JournalEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>[]
          }
          delete: {
            args: Prisma.JournalEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          update: {
            args: Prisma.JournalEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          deleteMany: {
            args: Prisma.JournalEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JournalEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JournalEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JournalEntryPayload>
          }
          aggregate: {
            args: Prisma.JournalEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJournalEntry>
          }
          groupBy: {
            args: Prisma.JournalEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.JournalEntryCountArgs<ExtArgs>
            result: $Utils.Optional<JournalEntryCountAggregateOutputType> | number
          }
        }
      }
      DailyPlan: {
        payload: Prisma.$DailyPlanPayload<ExtArgs>
        fields: Prisma.DailyPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          findFirst: {
            args: Prisma.DailyPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          findMany: {
            args: Prisma.DailyPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>[]
          }
          create: {
            args: Prisma.DailyPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          createMany: {
            args: Prisma.DailyPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>[]
          }
          delete: {
            args: Prisma.DailyPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          update: {
            args: Prisma.DailyPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          deleteMany: {
            args: Prisma.DailyPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DailyPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyPlanPayload>
          }
          aggregate: {
            args: Prisma.DailyPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyPlan>
          }
          groupBy: {
            args: Prisma.DailyPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyPlanCountArgs<ExtArgs>
            result: $Utils.Optional<DailyPlanCountAggregateOutputType> | number
          }
        }
      }
      NewsEvent: {
        payload: Prisma.$NewsEventPayload<ExtArgs>
        fields: Prisma.NewsEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          findFirst: {
            args: Prisma.NewsEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          findMany: {
            args: Prisma.NewsEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>[]
          }
          create: {
            args: Prisma.NewsEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          createMany: {
            args: Prisma.NewsEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>[]
          }
          delete: {
            args: Prisma.NewsEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          update: {
            args: Prisma.NewsEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          deleteMany: {
            args: Prisma.NewsEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          aggregate: {
            args: Prisma.NewsEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsEvent>
          }
          groupBy: {
            args: Prisma.NewsEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsEventCountArgs<ExtArgs>
            result: $Utils.Optional<NewsEventCountAggregateOutputType> | number
          }
        }
      }
      AlertLog: {
        payload: Prisma.$AlertLogPayload<ExtArgs>
        fields: Prisma.AlertLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          findFirst: {
            args: Prisma.AlertLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          findMany: {
            args: Prisma.AlertLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>[]
          }
          create: {
            args: Prisma.AlertLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          createMany: {
            args: Prisma.AlertLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlertLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>[]
          }
          delete: {
            args: Prisma.AlertLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          update: {
            args: Prisma.AlertLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          deleteMany: {
            args: Prisma.AlertLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlertLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          aggregate: {
            args: Prisma.AlertLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlertLog>
          }
          groupBy: {
            args: Prisma.AlertLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertLogCountArgs<ExtArgs>
            result: $Utils.Optional<AlertLogCountAggregateOutputType> | number
          }
        }
      }
      AnalysisCache: {
        payload: Prisma.$AnalysisCachePayload<ExtArgs>
        fields: Prisma.AnalysisCacheFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisCacheFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisCacheFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          findFirst: {
            args: Prisma.AnalysisCacheFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisCacheFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          findMany: {
            args: Prisma.AnalysisCacheFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>[]
          }
          create: {
            args: Prisma.AnalysisCacheCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          createMany: {
            args: Prisma.AnalysisCacheCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisCacheCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>[]
          }
          delete: {
            args: Prisma.AnalysisCacheDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          update: {
            args: Prisma.AnalysisCacheUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          deleteMany: {
            args: Prisma.AnalysisCacheDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisCacheUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnalysisCacheUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisCachePayload>
          }
          aggregate: {
            args: Prisma.AnalysisCacheAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisCache>
          }
          groupBy: {
            args: Prisma.AnalysisCacheGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisCacheGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisCacheCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisCacheCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    trades: number
    journal: number
    dailyPlans: number
    alertLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    trades?: boolean | UserCountOutputTypeCountTradesArgs
    journal?: boolean | UserCountOutputTypeCountJournalArgs
    dailyPlans?: boolean | UserCountOutputTypeCountDailyPlansArgs
    alertLogs?: boolean | UserCountOutputTypeCountAlertLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingAccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJournalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDailyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyPlanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAlertLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertLogWhereInput
  }


  /**
   * Count Type TradingAccountCountOutputType
   */

  export type TradingAccountCountOutputType = {
    trades: number
  }

  export type TradingAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | TradingAccountCountOutputTypeCountTradesArgs
  }

  // Custom InputTypes
  /**
   * TradingAccountCountOutputType without action
   */
  export type TradingAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccountCountOutputType
     */
    select?: TradingAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradingAccountCountOutputType without action
   */
  export type TradingAccountCountOutputTypeCountTradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
  }


  /**
   * Count Type TradeCountOutputType
   */

  export type TradeCountOutputType = {
    journalEntries: number
  }

  export type TradeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    journalEntries?: boolean | TradeCountOutputTypeCountJournalEntriesArgs
  }

  // Custom InputTypes
  /**
   * TradeCountOutputType without action
   */
  export type TradeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeCountOutputType
     */
    select?: TradeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradeCountOutputType without action
   */
  export type TradeCountOutputTypeCountJournalEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
  }


  /**
   * Count Type AlertLogCountOutputType
   */

  export type AlertLogCountOutputType = {
    trades: number
  }

  export type AlertLogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | AlertLogCountOutputTypeCountTradesArgs
  }

  // Custom InputTypes
  /**
   * AlertLogCountOutputType without action
   */
  export type AlertLogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLogCountOutputType
     */
    select?: AlertLogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlertLogCountOutputType without action
   */
  export type AlertLogCountOutputTypeCountTradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    telegramChatId: string | null
    telegramLinkCode: string | null
    telegramLinkCodeExpiresAt: Date | null
    telegramAlertsEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    telegramChatId: string | null
    telegramLinkCode: string | null
    telegramLinkCodeExpiresAt: Date | null
    telegramAlertsEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    telegramChatId: number
    telegramLinkCode: number
    telegramLinkCodeExpiresAt: number
    telegramAlertsEnabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    telegramChatId?: true
    telegramLinkCode?: true
    telegramLinkCodeExpiresAt?: true
    telegramAlertsEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    telegramChatId?: true
    telegramLinkCode?: true
    telegramLinkCodeExpiresAt?: true
    telegramAlertsEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    telegramChatId?: true
    telegramLinkCode?: true
    telegramLinkCodeExpiresAt?: true
    telegramAlertsEnabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    telegramChatId: string | null
    telegramLinkCode: string | null
    telegramLinkCodeExpiresAt: Date | null
    telegramAlertsEnabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    telegramChatId?: boolean
    telegramLinkCode?: boolean
    telegramLinkCodeExpiresAt?: boolean
    telegramAlertsEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    trades?: boolean | User$tradesArgs<ExtArgs>
    journal?: boolean | User$journalArgs<ExtArgs>
    dailyPlans?: boolean | User$dailyPlansArgs<ExtArgs>
    alertLogs?: boolean | User$alertLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    telegramChatId?: boolean
    telegramLinkCode?: boolean
    telegramLinkCodeExpiresAt?: boolean
    telegramAlertsEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    telegramChatId?: boolean
    telegramLinkCode?: boolean
    telegramLinkCodeExpiresAt?: boolean
    telegramAlertsEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    trades?: boolean | User$tradesArgs<ExtArgs>
    journal?: boolean | User$journalArgs<ExtArgs>
    dailyPlans?: boolean | User$dailyPlansArgs<ExtArgs>
    alertLogs?: boolean | User$alertLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$TradingAccountPayload<ExtArgs>[]
      trades: Prisma.$TradePayload<ExtArgs>[]
      journal: Prisma.$JournalEntryPayload<ExtArgs>[]
      dailyPlans: Prisma.$DailyPlanPayload<ExtArgs>[]
      alertLogs: Prisma.$AlertLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      telegramChatId: string | null
      telegramLinkCode: string | null
      telegramLinkCodeExpiresAt: Date | null
      telegramAlertsEnabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findMany"> | Null>
    trades<T extends User$tradesArgs<ExtArgs> = {}>(args?: Subset<T, User$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany"> | Null>
    journal<T extends User$journalArgs<ExtArgs> = {}>(args?: Subset<T, User$journalArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany"> | Null>
    dailyPlans<T extends User$dailyPlansArgs<ExtArgs> = {}>(args?: Subset<T, User$dailyPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findMany"> | Null>
    alertLogs<T extends User$alertLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$alertLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly telegramChatId: FieldRef<"User", 'String'>
    readonly telegramLinkCode: FieldRef<"User", 'String'>
    readonly telegramLinkCodeExpiresAt: FieldRef<"User", 'DateTime'>
    readonly telegramAlertsEnabled: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    where?: TradingAccountWhereInput
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    cursor?: TradingAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * User.trades
   */
  export type User$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    cursor?: TradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * User.journal
   */
  export type User$journalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * User.dailyPlans
   */
  export type User$dailyPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    where?: DailyPlanWhereInput
    orderBy?: DailyPlanOrderByWithRelationInput | DailyPlanOrderByWithRelationInput[]
    cursor?: DailyPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyPlanScalarFieldEnum | DailyPlanScalarFieldEnum[]
  }

  /**
   * User.alertLogs
   */
  export type User$alertLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    where?: AlertLogWhereInput
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    cursor?: AlertLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model TradingAccount
   */

  export type AggregateTradingAccount = {
    _count: TradingAccountCountAggregateOutputType | null
    _avg: TradingAccountAvgAggregateOutputType | null
    _sum: TradingAccountSumAggregateOutputType | null
    _min: TradingAccountMinAggregateOutputType | null
    _max: TradingAccountMaxAggregateOutputType | null
  }

  export type TradingAccountAvgAggregateOutputType = {
    balance: Decimal | null
    equity: Decimal | null
    riskPercent: Decimal | null
    maxDailyLoss: Decimal | null
    maxDrawdown: Decimal | null
    maxTradesPerDay: number | null
    currentDailyLoss: Decimal | null
    currentDailyTrades: number | null
    lossesInARow: number | null
  }

  export type TradingAccountSumAggregateOutputType = {
    balance: Decimal | null
    equity: Decimal | null
    riskPercent: Decimal | null
    maxDailyLoss: Decimal | null
    maxDrawdown: Decimal | null
    maxTradesPerDay: number | null
    currentDailyLoss: Decimal | null
    currentDailyTrades: number | null
    lossesInARow: number | null
  }

  export type TradingAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    mode: $Enums.AccountMode | null
    balance: Decimal | null
    equity: Decimal | null
    riskPercent: Decimal | null
    maxDailyLoss: Decimal | null
    maxDrawdown: Decimal | null
    maxTradesPerDay: number | null
    currentDailyLoss: Decimal | null
    currentDailyTrades: number | null
    lossesInARow: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    mode: $Enums.AccountMode | null
    balance: Decimal | null
    equity: Decimal | null
    riskPercent: Decimal | null
    maxDailyLoss: Decimal | null
    maxDrawdown: Decimal | null
    maxTradesPerDay: number | null
    currentDailyLoss: Decimal | null
    currentDailyTrades: number | null
    lossesInARow: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingAccountCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    mode: number
    balance: number
    equity: number
    riskPercent: number
    maxDailyLoss: number
    maxDrawdown: number
    maxTradesPerDay: number
    currentDailyLoss: number
    currentDailyTrades: number
    lossesInARow: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradingAccountAvgAggregateInputType = {
    balance?: true
    equity?: true
    riskPercent?: true
    maxDailyLoss?: true
    maxDrawdown?: true
    maxTradesPerDay?: true
    currentDailyLoss?: true
    currentDailyTrades?: true
    lossesInARow?: true
  }

  export type TradingAccountSumAggregateInputType = {
    balance?: true
    equity?: true
    riskPercent?: true
    maxDailyLoss?: true
    maxDrawdown?: true
    maxTradesPerDay?: true
    currentDailyLoss?: true
    currentDailyTrades?: true
    lossesInARow?: true
  }

  export type TradingAccountMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    mode?: true
    balance?: true
    equity?: true
    riskPercent?: true
    maxDailyLoss?: true
    maxDrawdown?: true
    maxTradesPerDay?: true
    currentDailyLoss?: true
    currentDailyTrades?: true
    lossesInARow?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    mode?: true
    balance?: true
    equity?: true
    riskPercent?: true
    maxDailyLoss?: true
    maxDrawdown?: true
    maxTradesPerDay?: true
    currentDailyLoss?: true
    currentDailyTrades?: true
    lossesInARow?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingAccountCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    mode?: true
    balance?: true
    equity?: true
    riskPercent?: true
    maxDailyLoss?: true
    maxDrawdown?: true
    maxTradesPerDay?: true
    currentDailyLoss?: true
    currentDailyTrades?: true
    lossesInARow?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingAccount to aggregate.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingAccounts
    **/
    _count?: true | TradingAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingAccountMaxAggregateInputType
  }

  export type GetTradingAccountAggregateType<T extends TradingAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingAccount[P]>
      : GetScalarType<T[P], AggregateTradingAccount[P]>
  }




  export type TradingAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingAccountWhereInput
    orderBy?: TradingAccountOrderByWithAggregationInput | TradingAccountOrderByWithAggregationInput[]
    by: TradingAccountScalarFieldEnum[] | TradingAccountScalarFieldEnum
    having?: TradingAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingAccountCountAggregateInputType | true
    _avg?: TradingAccountAvgAggregateInputType
    _sum?: TradingAccountSumAggregateInputType
    _min?: TradingAccountMinAggregateInputType
    _max?: TradingAccountMaxAggregateInputType
  }

  export type TradingAccountGroupByOutputType = {
    id: string
    userId: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal
    equity: Decimal
    riskPercent: Decimal
    maxDailyLoss: Decimal
    maxDrawdown: Decimal
    maxTradesPerDay: number
    currentDailyLoss: Decimal
    currentDailyTrades: number
    lossesInARow: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TradingAccountCountAggregateOutputType | null
    _avg: TradingAccountAvgAggregateOutputType | null
    _sum: TradingAccountSumAggregateOutputType | null
    _min: TradingAccountMinAggregateOutputType | null
    _max: TradingAccountMaxAggregateOutputType | null
  }

  type GetTradingAccountGroupByPayload<T extends TradingAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingAccountGroupByOutputType[P]>
            : GetScalarType<T[P], TradingAccountGroupByOutputType[P]>
        }
      >
    >


  export type TradingAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    mode?: boolean
    balance?: boolean
    equity?: boolean
    riskPercent?: boolean
    maxDailyLoss?: boolean
    maxDrawdown?: boolean
    maxTradesPerDay?: boolean
    currentDailyLoss?: boolean
    currentDailyTrades?: boolean
    lossesInARow?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    trades?: boolean | TradingAccount$tradesArgs<ExtArgs>
    _count?: boolean | TradingAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingAccount"]>

  export type TradingAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    mode?: boolean
    balance?: boolean
    equity?: boolean
    riskPercent?: boolean
    maxDailyLoss?: boolean
    maxDrawdown?: boolean
    maxTradesPerDay?: boolean
    currentDailyLoss?: boolean
    currentDailyTrades?: boolean
    lossesInARow?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingAccount"]>

  export type TradingAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    mode?: boolean
    balance?: boolean
    equity?: boolean
    riskPercent?: boolean
    maxDailyLoss?: boolean
    maxDrawdown?: boolean
    maxTradesPerDay?: boolean
    currentDailyLoss?: boolean
    currentDailyTrades?: boolean
    lossesInARow?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradingAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    trades?: boolean | TradingAccount$tradesArgs<ExtArgs>
    _count?: boolean | TradingAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradingAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TradingAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingAccount"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      trades: Prisma.$TradePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      mode: $Enums.AccountMode
      balance: Prisma.Decimal
      equity: Prisma.Decimal
      riskPercent: Prisma.Decimal
      maxDailyLoss: Prisma.Decimal
      maxDrawdown: Prisma.Decimal
      maxTradesPerDay: number
      currentDailyLoss: Prisma.Decimal
      currentDailyTrades: number
      lossesInARow: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradingAccount"]>
    composites: {}
  }

  type TradingAccountGetPayload<S extends boolean | null | undefined | TradingAccountDefaultArgs> = $Result.GetResult<Prisma.$TradingAccountPayload, S>

  type TradingAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TradingAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TradingAccountCountAggregateInputType | true
    }

  export interface TradingAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingAccount'], meta: { name: 'TradingAccount' } }
    /**
     * Find zero or one TradingAccount that matches the filter.
     * @param {TradingAccountFindUniqueArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingAccountFindUniqueArgs>(args: SelectSubset<T, TradingAccountFindUniqueArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TradingAccount that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TradingAccountFindUniqueOrThrowArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TradingAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindFirstArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingAccountFindFirstArgs>(args?: SelectSubset<T, TradingAccountFindFirstArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TradingAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindFirstOrThrowArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TradingAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingAccounts
     * const tradingAccounts = await prisma.tradingAccount.findMany()
     * 
     * // Get first 10 TradingAccounts
     * const tradingAccounts = await prisma.tradingAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingAccountWithIdOnly = await prisma.tradingAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingAccountFindManyArgs>(args?: SelectSubset<T, TradingAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TradingAccount.
     * @param {TradingAccountCreateArgs} args - Arguments to create a TradingAccount.
     * @example
     * // Create one TradingAccount
     * const TradingAccount = await prisma.tradingAccount.create({
     *   data: {
     *     // ... data to create a TradingAccount
     *   }
     * })
     * 
     */
    create<T extends TradingAccountCreateArgs>(args: SelectSubset<T, TradingAccountCreateArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TradingAccounts.
     * @param {TradingAccountCreateManyArgs} args - Arguments to create many TradingAccounts.
     * @example
     * // Create many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingAccountCreateManyArgs>(args?: SelectSubset<T, TradingAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingAccounts and returns the data saved in the database.
     * @param {TradingAccountCreateManyAndReturnArgs} args - Arguments to create many TradingAccounts.
     * @example
     * // Create many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingAccounts and only return the `id`
     * const tradingAccountWithIdOnly = await prisma.tradingAccount.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TradingAccount.
     * @param {TradingAccountDeleteArgs} args - Arguments to delete one TradingAccount.
     * @example
     * // Delete one TradingAccount
     * const TradingAccount = await prisma.tradingAccount.delete({
     *   where: {
     *     // ... filter to delete one TradingAccount
     *   }
     * })
     * 
     */
    delete<T extends TradingAccountDeleteArgs>(args: SelectSubset<T, TradingAccountDeleteArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TradingAccount.
     * @param {TradingAccountUpdateArgs} args - Arguments to update one TradingAccount.
     * @example
     * // Update one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingAccountUpdateArgs>(args: SelectSubset<T, TradingAccountUpdateArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TradingAccounts.
     * @param {TradingAccountDeleteManyArgs} args - Arguments to filter TradingAccounts to delete.
     * @example
     * // Delete a few TradingAccounts
     * const { count } = await prisma.tradingAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingAccountDeleteManyArgs>(args?: SelectSubset<T, TradingAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingAccountUpdateManyArgs>(args: SelectSubset<T, TradingAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TradingAccount.
     * @param {TradingAccountUpsertArgs} args - Arguments to update or create a TradingAccount.
     * @example
     * // Update or create a TradingAccount
     * const tradingAccount = await prisma.tradingAccount.upsert({
     *   create: {
     *     // ... data to create a TradingAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingAccount we want to update
     *   }
     * })
     */
    upsert<T extends TradingAccountUpsertArgs>(args: SelectSubset<T, TradingAccountUpsertArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TradingAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountCountArgs} args - Arguments to filter TradingAccounts to count.
     * @example
     * // Count the number of TradingAccounts
     * const count = await prisma.tradingAccount.count({
     *   where: {
     *     // ... the filter for the TradingAccounts we want to count
     *   }
     * })
    **/
    count<T extends TradingAccountCountArgs>(
      args?: Subset<T, TradingAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradingAccountAggregateArgs>(args: Subset<T, TradingAccountAggregateArgs>): Prisma.PrismaPromise<GetTradingAccountAggregateType<T>>

    /**
     * Group by TradingAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradingAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingAccountGroupByArgs['orderBy'] }
        : { orderBy?: TradingAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradingAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingAccount model
   */
  readonly fields: TradingAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    trades<T extends TradingAccount$tradesArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccount$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradingAccount model
   */ 
  interface TradingAccountFieldRefs {
    readonly id: FieldRef<"TradingAccount", 'String'>
    readonly userId: FieldRef<"TradingAccount", 'String'>
    readonly name: FieldRef<"TradingAccount", 'String'>
    readonly mode: FieldRef<"TradingAccount", 'AccountMode'>
    readonly balance: FieldRef<"TradingAccount", 'Decimal'>
    readonly equity: FieldRef<"TradingAccount", 'Decimal'>
    readonly riskPercent: FieldRef<"TradingAccount", 'Decimal'>
    readonly maxDailyLoss: FieldRef<"TradingAccount", 'Decimal'>
    readonly maxDrawdown: FieldRef<"TradingAccount", 'Decimal'>
    readonly maxTradesPerDay: FieldRef<"TradingAccount", 'Int'>
    readonly currentDailyLoss: FieldRef<"TradingAccount", 'Decimal'>
    readonly currentDailyTrades: FieldRef<"TradingAccount", 'Int'>
    readonly lossesInARow: FieldRef<"TradingAccount", 'Int'>
    readonly isActive: FieldRef<"TradingAccount", 'Boolean'>
    readonly createdAt: FieldRef<"TradingAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"TradingAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingAccount findUnique
   */
  export type TradingAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount findUniqueOrThrow
   */
  export type TradingAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount findFirst
   */
  export type TradingAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingAccounts.
     */
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount findFirstOrThrow
   */
  export type TradingAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingAccounts.
     */
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount findMany
   */
  export type TradingAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccounts to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount create
   */
  export type TradingAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingAccount.
     */
    data: XOR<TradingAccountCreateInput, TradingAccountUncheckedCreateInput>
  }

  /**
   * TradingAccount createMany
   */
  export type TradingAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingAccounts.
     */
    data: TradingAccountCreateManyInput | TradingAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingAccount createManyAndReturn
   */
  export type TradingAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TradingAccounts.
     */
    data: TradingAccountCreateManyInput | TradingAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingAccount update
   */
  export type TradingAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingAccount.
     */
    data: XOR<TradingAccountUpdateInput, TradingAccountUncheckedUpdateInput>
    /**
     * Choose, which TradingAccount to update.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount updateMany
   */
  export type TradingAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingAccounts.
     */
    data: XOR<TradingAccountUpdateManyMutationInput, TradingAccountUncheckedUpdateManyInput>
    /**
     * Filter which TradingAccounts to update
     */
    where?: TradingAccountWhereInput
  }

  /**
   * TradingAccount upsert
   */
  export type TradingAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingAccount to update in case it exists.
     */
    where: TradingAccountWhereUniqueInput
    /**
     * In case the TradingAccount found by the `where` argument doesn't exist, create a new TradingAccount with this data.
     */
    create: XOR<TradingAccountCreateInput, TradingAccountUncheckedCreateInput>
    /**
     * In case the TradingAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingAccountUpdateInput, TradingAccountUncheckedUpdateInput>
  }

  /**
   * TradingAccount delete
   */
  export type TradingAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter which TradingAccount to delete.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount deleteMany
   */
  export type TradingAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingAccounts to delete
     */
    where?: TradingAccountWhereInput
  }

  /**
   * TradingAccount.trades
   */
  export type TradingAccount$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    cursor?: TradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * TradingAccount without action
   */
  export type TradingAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
  }


  /**
   * Model Trade
   */

  export type AggregateTrade = {
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  export type TradeAvgAggregateOutputType = {
    entryPrice: Decimal | null
    stopLoss: Decimal | null
    takeProfit: Decimal | null
    lotSize: Decimal | null
    riskAmount: Decimal | null
    riskRewardRatio: Decimal | null
    pnl: Decimal | null
    pipsPnl: Decimal | null
    aiScore: number | null
  }

  export type TradeSumAggregateOutputType = {
    entryPrice: Decimal | null
    stopLoss: Decimal | null
    takeProfit: Decimal | null
    lotSize: Decimal | null
    riskAmount: Decimal | null
    riskRewardRatio: Decimal | null
    pnl: Decimal | null
    pipsPnl: Decimal | null
    aiScore: number | null
  }

  export type TradeMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    userId: string | null
    externalRef: string | null
    alertLogId: string | null
    pair: string | null
    direction: $Enums.TradeDirection | null
    setupType: $Enums.SetupType | null
    entryPrice: Decimal | null
    stopLoss: Decimal | null
    takeProfit: Decimal | null
    lotSize: Decimal | null
    riskAmount: Decimal | null
    riskRewardRatio: Decimal | null
    status: $Enums.TradeStatus | null
    entryStatus: $Enums.EntryStatus | null
    pnl: Decimal | null
    pipsPnl: Decimal | null
    aiScore: number | null
    aiDecision: string | null
    aiReasoning: string | null
    denialReason: string | null
    notes: string | null
    openedAt: Date | null
    closedAt: Date | null
    createdAt: Date | null
  }

  export type TradeMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    userId: string | null
    externalRef: string | null
    alertLogId: string | null
    pair: string | null
    direction: $Enums.TradeDirection | null
    setupType: $Enums.SetupType | null
    entryPrice: Decimal | null
    stopLoss: Decimal | null
    takeProfit: Decimal | null
    lotSize: Decimal | null
    riskAmount: Decimal | null
    riskRewardRatio: Decimal | null
    status: $Enums.TradeStatus | null
    entryStatus: $Enums.EntryStatus | null
    pnl: Decimal | null
    pipsPnl: Decimal | null
    aiScore: number | null
    aiDecision: string | null
    aiReasoning: string | null
    denialReason: string | null
    notes: string | null
    openedAt: Date | null
    closedAt: Date | null
    createdAt: Date | null
  }

  export type TradeCountAggregateOutputType = {
    id: number
    accountId: number
    userId: number
    externalRef: number
    alertLogId: number
    pair: number
    direction: number
    setupType: number
    entryPrice: number
    stopLoss: number
    takeProfit: number
    lotSize: number
    riskAmount: number
    riskRewardRatio: number
    status: number
    entryStatus: number
    pnl: number
    pipsPnl: number
    aiScore: number
    aiDecision: number
    aiReasoning: number
    denialReason: number
    notes: number
    openedAt: number
    closedAt: number
    createdAt: number
    _all: number
  }


  export type TradeAvgAggregateInputType = {
    entryPrice?: true
    stopLoss?: true
    takeProfit?: true
    lotSize?: true
    riskAmount?: true
    riskRewardRatio?: true
    pnl?: true
    pipsPnl?: true
    aiScore?: true
  }

  export type TradeSumAggregateInputType = {
    entryPrice?: true
    stopLoss?: true
    takeProfit?: true
    lotSize?: true
    riskAmount?: true
    riskRewardRatio?: true
    pnl?: true
    pipsPnl?: true
    aiScore?: true
  }

  export type TradeMinAggregateInputType = {
    id?: true
    accountId?: true
    userId?: true
    externalRef?: true
    alertLogId?: true
    pair?: true
    direction?: true
    setupType?: true
    entryPrice?: true
    stopLoss?: true
    takeProfit?: true
    lotSize?: true
    riskAmount?: true
    riskRewardRatio?: true
    status?: true
    entryStatus?: true
    pnl?: true
    pipsPnl?: true
    aiScore?: true
    aiDecision?: true
    aiReasoning?: true
    denialReason?: true
    notes?: true
    openedAt?: true
    closedAt?: true
    createdAt?: true
  }

  export type TradeMaxAggregateInputType = {
    id?: true
    accountId?: true
    userId?: true
    externalRef?: true
    alertLogId?: true
    pair?: true
    direction?: true
    setupType?: true
    entryPrice?: true
    stopLoss?: true
    takeProfit?: true
    lotSize?: true
    riskAmount?: true
    riskRewardRatio?: true
    status?: true
    entryStatus?: true
    pnl?: true
    pipsPnl?: true
    aiScore?: true
    aiDecision?: true
    aiReasoning?: true
    denialReason?: true
    notes?: true
    openedAt?: true
    closedAt?: true
    createdAt?: true
  }

  export type TradeCountAggregateInputType = {
    id?: true
    accountId?: true
    userId?: true
    externalRef?: true
    alertLogId?: true
    pair?: true
    direction?: true
    setupType?: true
    entryPrice?: true
    stopLoss?: true
    takeProfit?: true
    lotSize?: true
    riskAmount?: true
    riskRewardRatio?: true
    status?: true
    entryStatus?: true
    pnl?: true
    pipsPnl?: true
    aiScore?: true
    aiDecision?: true
    aiReasoning?: true
    denialReason?: true
    notes?: true
    openedAt?: true
    closedAt?: true
    createdAt?: true
    _all?: true
  }

  export type TradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trade to aggregate.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trades
    **/
    _count?: true | TradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeMaxAggregateInputType
  }

  export type GetTradeAggregateType<T extends TradeAggregateArgs> = {
        [P in keyof T & keyof AggregateTrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrade[P]>
      : GetScalarType<T[P], AggregateTrade[P]>
  }




  export type TradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithAggregationInput | TradeOrderByWithAggregationInput[]
    by: TradeScalarFieldEnum[] | TradeScalarFieldEnum
    having?: TradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeCountAggregateInputType | true
    _avg?: TradeAvgAggregateInputType
    _sum?: TradeSumAggregateInputType
    _min?: TradeMinAggregateInputType
    _max?: TradeMaxAggregateInputType
  }

  export type TradeGroupByOutputType = {
    id: string
    accountId: string
    userId: string
    externalRef: string | null
    alertLogId: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal
    stopLoss: Decimal
    takeProfit: Decimal
    lotSize: Decimal
    riskAmount: Decimal
    riskRewardRatio: Decimal
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl: Decimal | null
    pipsPnl: Decimal | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason: string | null
    notes: string | null
    openedAt: Date | null
    closedAt: Date | null
    createdAt: Date
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  type GetTradeGroupByPayload<T extends TradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeGroupByOutputType[P]>
            : GetScalarType<T[P], TradeGroupByOutputType[P]>
        }
      >
    >


  export type TradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    userId?: boolean
    externalRef?: boolean
    alertLogId?: boolean
    pair?: boolean
    direction?: boolean
    setupType?: boolean
    entryPrice?: boolean
    stopLoss?: boolean
    takeProfit?: boolean
    lotSize?: boolean
    riskAmount?: boolean
    riskRewardRatio?: boolean
    status?: boolean
    entryStatus?: boolean
    pnl?: boolean
    pipsPnl?: boolean
    aiScore?: boolean
    aiDecision?: boolean
    aiReasoning?: boolean
    denialReason?: boolean
    notes?: boolean
    openedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    alertLog?: boolean | Trade$alertLogArgs<ExtArgs>
    journalEntries?: boolean | Trade$journalEntriesArgs<ExtArgs>
    _count?: boolean | TradeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    userId?: boolean
    externalRef?: boolean
    alertLogId?: boolean
    pair?: boolean
    direction?: boolean
    setupType?: boolean
    entryPrice?: boolean
    stopLoss?: boolean
    takeProfit?: boolean
    lotSize?: boolean
    riskAmount?: boolean
    riskRewardRatio?: boolean
    status?: boolean
    entryStatus?: boolean
    pnl?: boolean
    pipsPnl?: boolean
    aiScore?: boolean
    aiDecision?: boolean
    aiReasoning?: boolean
    denialReason?: boolean
    notes?: boolean
    openedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    alertLog?: boolean | Trade$alertLogArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectScalar = {
    id?: boolean
    accountId?: boolean
    userId?: boolean
    externalRef?: boolean
    alertLogId?: boolean
    pair?: boolean
    direction?: boolean
    setupType?: boolean
    entryPrice?: boolean
    stopLoss?: boolean
    takeProfit?: boolean
    lotSize?: boolean
    riskAmount?: boolean
    riskRewardRatio?: boolean
    status?: boolean
    entryStatus?: boolean
    pnl?: boolean
    pipsPnl?: boolean
    aiScore?: boolean
    aiDecision?: boolean
    aiReasoning?: boolean
    denialReason?: boolean
    notes?: boolean
    openedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
  }

  export type TradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    alertLog?: boolean | Trade$alertLogArgs<ExtArgs>
    journalEntries?: boolean | Trade$journalEntriesArgs<ExtArgs>
    _count?: boolean | TradeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    alertLog?: boolean | Trade$alertLogArgs<ExtArgs>
  }

  export type $TradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trade"
    objects: {
      account: Prisma.$TradingAccountPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      alertLog: Prisma.$AlertLogPayload<ExtArgs> | null
      journalEntries: Prisma.$JournalEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      userId: string
      externalRef: string | null
      alertLogId: string | null
      pair: string
      direction: $Enums.TradeDirection
      setupType: $Enums.SetupType
      entryPrice: Prisma.Decimal
      stopLoss: Prisma.Decimal
      takeProfit: Prisma.Decimal
      lotSize: Prisma.Decimal
      riskAmount: Prisma.Decimal
      riskRewardRatio: Prisma.Decimal
      status: $Enums.TradeStatus
      entryStatus: $Enums.EntryStatus
      pnl: Prisma.Decimal | null
      pipsPnl: Prisma.Decimal | null
      aiScore: number
      aiDecision: string
      aiReasoning: string
      denialReason: string | null
      notes: string | null
      openedAt: Date | null
      closedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["trade"]>
    composites: {}
  }

  type TradeGetPayload<S extends boolean | null | undefined | TradeDefaultArgs> = $Result.GetResult<Prisma.$TradePayload, S>

  type TradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TradeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TradeCountAggregateInputType | true
    }

  export interface TradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trade'], meta: { name: 'Trade' } }
    /**
     * Find zero or one Trade that matches the filter.
     * @param {TradeFindUniqueArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeFindUniqueArgs>(args: SelectSubset<T, TradeFindUniqueArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Trade that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TradeFindUniqueOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Trade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeFindFirstArgs>(args?: SelectSubset<T, TradeFindFirstArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Trade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Trades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trades
     * const trades = await prisma.trade.findMany()
     * 
     * // Get first 10 Trades
     * const trades = await prisma.trade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeWithIdOnly = await prisma.trade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeFindManyArgs>(args?: SelectSubset<T, TradeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Trade.
     * @param {TradeCreateArgs} args - Arguments to create a Trade.
     * @example
     * // Create one Trade
     * const Trade = await prisma.trade.create({
     *   data: {
     *     // ... data to create a Trade
     *   }
     * })
     * 
     */
    create<T extends TradeCreateArgs>(args: SelectSubset<T, TradeCreateArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Trades.
     * @param {TradeCreateManyArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeCreateManyArgs>(args?: SelectSubset<T, TradeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trades and returns the data saved in the database.
     * @param {TradeCreateManyAndReturnArgs} args - Arguments to create many Trades.
     * @example
     * // Create many Trades
     * const trade = await prisma.trade.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trades and only return the `id`
     * const tradeWithIdOnly = await prisma.trade.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Trade.
     * @param {TradeDeleteArgs} args - Arguments to delete one Trade.
     * @example
     * // Delete one Trade
     * const Trade = await prisma.trade.delete({
     *   where: {
     *     // ... filter to delete one Trade
     *   }
     * })
     * 
     */
    delete<T extends TradeDeleteArgs>(args: SelectSubset<T, TradeDeleteArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Trade.
     * @param {TradeUpdateArgs} args - Arguments to update one Trade.
     * @example
     * // Update one Trade
     * const trade = await prisma.trade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeUpdateArgs>(args: SelectSubset<T, TradeUpdateArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Trades.
     * @param {TradeDeleteManyArgs} args - Arguments to filter Trades to delete.
     * @example
     * // Delete a few Trades
     * const { count } = await prisma.trade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeDeleteManyArgs>(args?: SelectSubset<T, TradeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeUpdateManyArgs>(args: SelectSubset<T, TradeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Trade.
     * @param {TradeUpsertArgs} args - Arguments to update or create a Trade.
     * @example
     * // Update or create a Trade
     * const trade = await prisma.trade.upsert({
     *   create: {
     *     // ... data to create a Trade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trade we want to update
     *   }
     * })
     */
    upsert<T extends TradeUpsertArgs>(args: SelectSubset<T, TradeUpsertArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeCountArgs} args - Arguments to filter Trades to count.
     * @example
     * // Count the number of Trades
     * const count = await prisma.trade.count({
     *   where: {
     *     // ... the filter for the Trades we want to count
     *   }
     * })
    **/
    count<T extends TradeCountArgs>(
      args?: Subset<T, TradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeAggregateArgs>(args: Subset<T, TradeAggregateArgs>): Prisma.PrismaPromise<GetTradeAggregateType<T>>

    /**
     * Group by Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeGroupByArgs['orderBy'] }
        : { orderBy?: TradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trade model
   */
  readonly fields: TradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends TradingAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccountDefaultArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    alertLog<T extends Trade$alertLogArgs<ExtArgs> = {}>(args?: Subset<T, Trade$alertLogArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    journalEntries<T extends Trade$journalEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Trade$journalEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Trade model
   */ 
  interface TradeFieldRefs {
    readonly id: FieldRef<"Trade", 'String'>
    readonly accountId: FieldRef<"Trade", 'String'>
    readonly userId: FieldRef<"Trade", 'String'>
    readonly externalRef: FieldRef<"Trade", 'String'>
    readonly alertLogId: FieldRef<"Trade", 'String'>
    readonly pair: FieldRef<"Trade", 'String'>
    readonly direction: FieldRef<"Trade", 'TradeDirection'>
    readonly setupType: FieldRef<"Trade", 'SetupType'>
    readonly entryPrice: FieldRef<"Trade", 'Decimal'>
    readonly stopLoss: FieldRef<"Trade", 'Decimal'>
    readonly takeProfit: FieldRef<"Trade", 'Decimal'>
    readonly lotSize: FieldRef<"Trade", 'Decimal'>
    readonly riskAmount: FieldRef<"Trade", 'Decimal'>
    readonly riskRewardRatio: FieldRef<"Trade", 'Decimal'>
    readonly status: FieldRef<"Trade", 'TradeStatus'>
    readonly entryStatus: FieldRef<"Trade", 'EntryStatus'>
    readonly pnl: FieldRef<"Trade", 'Decimal'>
    readonly pipsPnl: FieldRef<"Trade", 'Decimal'>
    readonly aiScore: FieldRef<"Trade", 'Int'>
    readonly aiDecision: FieldRef<"Trade", 'String'>
    readonly aiReasoning: FieldRef<"Trade", 'String'>
    readonly denialReason: FieldRef<"Trade", 'String'>
    readonly notes: FieldRef<"Trade", 'String'>
    readonly openedAt: FieldRef<"Trade", 'DateTime'>
    readonly closedAt: FieldRef<"Trade", 'DateTime'>
    readonly createdAt: FieldRef<"Trade", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Trade findUnique
   */
  export type TradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findUniqueOrThrow
   */
  export type TradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findFirst
   */
  export type TradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findFirstOrThrow
   */
  export type TradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findMany
   */
  export type TradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trades to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade create
   */
  export type TradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to create a Trade.
     */
    data: XOR<TradeCreateInput, TradeUncheckedCreateInput>
  }

  /**
   * Trade createMany
   */
  export type TradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trade createManyAndReturn
   */
  export type TradeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trade update
   */
  export type TradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to update a Trade.
     */
    data: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
    /**
     * Choose, which Trade to update.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade updateMany
   */
  export type TradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput
  }

  /**
   * Trade upsert
   */
  export type TradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The filter to search for the Trade to update in case it exists.
     */
    where: TradeWhereUniqueInput
    /**
     * In case the Trade found by the `where` argument doesn't exist, create a new Trade with this data.
     */
    create: XOR<TradeCreateInput, TradeUncheckedCreateInput>
    /**
     * In case the Trade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
  }

  /**
   * Trade delete
   */
  export type TradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter which Trade to delete.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade deleteMany
   */
  export type TradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trades to delete
     */
    where?: TradeWhereInput
  }

  /**
   * Trade.alertLog
   */
  export type Trade$alertLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    where?: AlertLogWhereInput
  }

  /**
   * Trade.journalEntries
   */
  export type Trade$journalEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    cursor?: JournalEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * Trade without action
   */
  export type TradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
  }


  /**
   * Model JournalEntry
   */

  export type AggregateJournalEntry = {
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  export type JournalEntryAvgAggregateOutputType = {
    disciplineScore: number | null
  }

  export type JournalEntrySumAggregateOutputType = {
    disciplineScore: number | null
  }

  export type JournalEntryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tradeId: string | null
    date: Date | null
    type: $Enums.JournalEntryType | null
    content: string | null
    disciplineScore: number | null
    aiFeedback: string | null
    createdAt: Date | null
  }

  export type JournalEntryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tradeId: string | null
    date: Date | null
    type: $Enums.JournalEntryType | null
    content: string | null
    disciplineScore: number | null
    aiFeedback: string | null
    createdAt: Date | null
  }

  export type JournalEntryCountAggregateOutputType = {
    id: number
    userId: number
    tradeId: number
    date: number
    type: number
    content: number
    mistakes: number
    disciplineScore: number
    aiFeedback: number
    tags: number
    createdAt: number
    _all: number
  }


  export type JournalEntryAvgAggregateInputType = {
    disciplineScore?: true
  }

  export type JournalEntrySumAggregateInputType = {
    disciplineScore?: true
  }

  export type JournalEntryMinAggregateInputType = {
    id?: true
    userId?: true
    tradeId?: true
    date?: true
    type?: true
    content?: true
    disciplineScore?: true
    aiFeedback?: true
    createdAt?: true
  }

  export type JournalEntryMaxAggregateInputType = {
    id?: true
    userId?: true
    tradeId?: true
    date?: true
    type?: true
    content?: true
    disciplineScore?: true
    aiFeedback?: true
    createdAt?: true
  }

  export type JournalEntryCountAggregateInputType = {
    id?: true
    userId?: true
    tradeId?: true
    date?: true
    type?: true
    content?: true
    mistakes?: true
    disciplineScore?: true
    aiFeedback?: true
    tags?: true
    createdAt?: true
    _all?: true
  }

  export type JournalEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntry to aggregate.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JournalEntries
    **/
    _count?: true | JournalEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JournalEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JournalEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JournalEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JournalEntryMaxAggregateInputType
  }

  export type GetJournalEntryAggregateType<T extends JournalEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateJournalEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJournalEntry[P]>
      : GetScalarType<T[P], AggregateJournalEntry[P]>
  }




  export type JournalEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JournalEntryWhereInput
    orderBy?: JournalEntryOrderByWithAggregationInput | JournalEntryOrderByWithAggregationInput[]
    by: JournalEntryScalarFieldEnum[] | JournalEntryScalarFieldEnum
    having?: JournalEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JournalEntryCountAggregateInputType | true
    _avg?: JournalEntryAvgAggregateInputType
    _sum?: JournalEntrySumAggregateInputType
    _min?: JournalEntryMinAggregateInputType
    _max?: JournalEntryMaxAggregateInputType
  }

  export type JournalEntryGroupByOutputType = {
    id: string
    userId: string
    tradeId: string | null
    date: Date
    type: $Enums.JournalEntryType
    content: string
    mistakes: string[]
    disciplineScore: number | null
    aiFeedback: string | null
    tags: string[]
    createdAt: Date
    _count: JournalEntryCountAggregateOutputType | null
    _avg: JournalEntryAvgAggregateOutputType | null
    _sum: JournalEntrySumAggregateOutputType | null
    _min: JournalEntryMinAggregateOutputType | null
    _max: JournalEntryMaxAggregateOutputType | null
  }

  type GetJournalEntryGroupByPayload<T extends JournalEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JournalEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JournalEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
            : GetScalarType<T[P], JournalEntryGroupByOutputType[P]>
        }
      >
    >


  export type JournalEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tradeId?: boolean
    date?: boolean
    type?: boolean
    content?: boolean
    mistakes?: boolean
    disciplineScore?: boolean
    aiFeedback?: boolean
    tags?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    trade?: boolean | JournalEntry$tradeArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tradeId?: boolean
    date?: boolean
    type?: boolean
    content?: boolean
    mistakes?: boolean
    disciplineScore?: boolean
    aiFeedback?: boolean
    tags?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    trade?: boolean | JournalEntry$tradeArgs<ExtArgs>
  }, ExtArgs["result"]["journalEntry"]>

  export type JournalEntrySelectScalar = {
    id?: boolean
    userId?: boolean
    tradeId?: boolean
    date?: boolean
    type?: boolean
    content?: boolean
    mistakes?: boolean
    disciplineScore?: boolean
    aiFeedback?: boolean
    tags?: boolean
    createdAt?: boolean
  }

  export type JournalEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    trade?: boolean | JournalEntry$tradeArgs<ExtArgs>
  }
  export type JournalEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    trade?: boolean | JournalEntry$tradeArgs<ExtArgs>
  }

  export type $JournalEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JournalEntry"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      trade: Prisma.$TradePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tradeId: string | null
      date: Date
      type: $Enums.JournalEntryType
      content: string
      mistakes: string[]
      disciplineScore: number | null
      aiFeedback: string | null
      tags: string[]
      createdAt: Date
    }, ExtArgs["result"]["journalEntry"]>
    composites: {}
  }

  type JournalEntryGetPayload<S extends boolean | null | undefined | JournalEntryDefaultArgs> = $Result.GetResult<Prisma.$JournalEntryPayload, S>

  type JournalEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JournalEntryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JournalEntryCountAggregateInputType | true
    }

  export interface JournalEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JournalEntry'], meta: { name: 'JournalEntry' } }
    /**
     * Find zero or one JournalEntry that matches the filter.
     * @param {JournalEntryFindUniqueArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JournalEntryFindUniqueArgs>(args: SelectSubset<T, JournalEntryFindUniqueArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one JournalEntry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JournalEntryFindUniqueOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JournalEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, JournalEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first JournalEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JournalEntryFindFirstArgs>(args?: SelectSubset<T, JournalEntryFindFirstArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first JournalEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindFirstOrThrowArgs} args - Arguments to find a JournalEntry
     * @example
     * // Get one JournalEntry
     * const journalEntry = await prisma.journalEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JournalEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, JournalEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more JournalEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany()
     * 
     * // Get first 10 JournalEntries
     * const journalEntries = await prisma.journalEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JournalEntryFindManyArgs>(args?: SelectSubset<T, JournalEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a JournalEntry.
     * @param {JournalEntryCreateArgs} args - Arguments to create a JournalEntry.
     * @example
     * // Create one JournalEntry
     * const JournalEntry = await prisma.journalEntry.create({
     *   data: {
     *     // ... data to create a JournalEntry
     *   }
     * })
     * 
     */
    create<T extends JournalEntryCreateArgs>(args: SelectSubset<T, JournalEntryCreateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many JournalEntries.
     * @param {JournalEntryCreateManyArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JournalEntryCreateManyArgs>(args?: SelectSubset<T, JournalEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JournalEntries and returns the data saved in the database.
     * @param {JournalEntryCreateManyAndReturnArgs} args - Arguments to create many JournalEntries.
     * @example
     * // Create many JournalEntries
     * const journalEntry = await prisma.journalEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JournalEntries and only return the `id`
     * const journalEntryWithIdOnly = await prisma.journalEntry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JournalEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, JournalEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a JournalEntry.
     * @param {JournalEntryDeleteArgs} args - Arguments to delete one JournalEntry.
     * @example
     * // Delete one JournalEntry
     * const JournalEntry = await prisma.journalEntry.delete({
     *   where: {
     *     // ... filter to delete one JournalEntry
     *   }
     * })
     * 
     */
    delete<T extends JournalEntryDeleteArgs>(args: SelectSubset<T, JournalEntryDeleteArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one JournalEntry.
     * @param {JournalEntryUpdateArgs} args - Arguments to update one JournalEntry.
     * @example
     * // Update one JournalEntry
     * const journalEntry = await prisma.journalEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JournalEntryUpdateArgs>(args: SelectSubset<T, JournalEntryUpdateArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more JournalEntries.
     * @param {JournalEntryDeleteManyArgs} args - Arguments to filter JournalEntries to delete.
     * @example
     * // Delete a few JournalEntries
     * const { count } = await prisma.journalEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JournalEntryDeleteManyArgs>(args?: SelectSubset<T, JournalEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JournalEntries
     * const journalEntry = await prisma.journalEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JournalEntryUpdateManyArgs>(args: SelectSubset<T, JournalEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one JournalEntry.
     * @param {JournalEntryUpsertArgs} args - Arguments to update or create a JournalEntry.
     * @example
     * // Update or create a JournalEntry
     * const journalEntry = await prisma.journalEntry.upsert({
     *   create: {
     *     // ... data to create a JournalEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JournalEntry we want to update
     *   }
     * })
     */
    upsert<T extends JournalEntryUpsertArgs>(args: SelectSubset<T, JournalEntryUpsertArgs<ExtArgs>>): Prisma__JournalEntryClient<$Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of JournalEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryCountArgs} args - Arguments to filter JournalEntries to count.
     * @example
     * // Count the number of JournalEntries
     * const count = await prisma.journalEntry.count({
     *   where: {
     *     // ... the filter for the JournalEntries we want to count
     *   }
     * })
    **/
    count<T extends JournalEntryCountArgs>(
      args?: Subset<T, JournalEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JournalEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JournalEntryAggregateArgs>(args: Subset<T, JournalEntryAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryAggregateType<T>>

    /**
     * Group by JournalEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JournalEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JournalEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JournalEntryGroupByArgs['orderBy'] }
        : { orderBy?: JournalEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JournalEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JournalEntry model
   */
  readonly fields: JournalEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JournalEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JournalEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    trade<T extends JournalEntry$tradeArgs<ExtArgs> = {}>(args?: Subset<T, JournalEntry$tradeArgs<ExtArgs>>): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JournalEntry model
   */ 
  interface JournalEntryFieldRefs {
    readonly id: FieldRef<"JournalEntry", 'String'>
    readonly userId: FieldRef<"JournalEntry", 'String'>
    readonly tradeId: FieldRef<"JournalEntry", 'String'>
    readonly date: FieldRef<"JournalEntry", 'DateTime'>
    readonly type: FieldRef<"JournalEntry", 'JournalEntryType'>
    readonly content: FieldRef<"JournalEntry", 'String'>
    readonly mistakes: FieldRef<"JournalEntry", 'String[]'>
    readonly disciplineScore: FieldRef<"JournalEntry", 'Int'>
    readonly aiFeedback: FieldRef<"JournalEntry", 'String'>
    readonly tags: FieldRef<"JournalEntry", 'String[]'>
    readonly createdAt: FieldRef<"JournalEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JournalEntry findUnique
   */
  export type JournalEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findUniqueOrThrow
   */
  export type JournalEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry findFirst
   */
  export type JournalEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findFirstOrThrow
   */
  export type JournalEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntry to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JournalEntries.
     */
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry findMany
   */
  export type JournalEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter, which JournalEntries to fetch.
     */
    where?: JournalEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JournalEntries to fetch.
     */
    orderBy?: JournalEntryOrderByWithRelationInput | JournalEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JournalEntries.
     */
    cursor?: JournalEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JournalEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JournalEntries.
     */
    skip?: number
    distinct?: JournalEntryScalarFieldEnum | JournalEntryScalarFieldEnum[]
  }

  /**
   * JournalEntry create
   */
  export type JournalEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a JournalEntry.
     */
    data: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
  }

  /**
   * JournalEntry createMany
   */
  export type JournalEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JournalEntry createManyAndReturn
   */
  export type JournalEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many JournalEntries.
     */
    data: JournalEntryCreateManyInput | JournalEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JournalEntry update
   */
  export type JournalEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a JournalEntry.
     */
    data: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
    /**
     * Choose, which JournalEntry to update.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry updateMany
   */
  export type JournalEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JournalEntries.
     */
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyInput>
    /**
     * Filter which JournalEntries to update
     */
    where?: JournalEntryWhereInput
  }

  /**
   * JournalEntry upsert
   */
  export type JournalEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the JournalEntry to update in case it exists.
     */
    where: JournalEntryWhereUniqueInput
    /**
     * In case the JournalEntry found by the `where` argument doesn't exist, create a new JournalEntry with this data.
     */
    create: XOR<JournalEntryCreateInput, JournalEntryUncheckedCreateInput>
    /**
     * In case the JournalEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JournalEntryUpdateInput, JournalEntryUncheckedUpdateInput>
  }

  /**
   * JournalEntry delete
   */
  export type JournalEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
    /**
     * Filter which JournalEntry to delete.
     */
    where: JournalEntryWhereUniqueInput
  }

  /**
   * JournalEntry deleteMany
   */
  export type JournalEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JournalEntries to delete
     */
    where?: JournalEntryWhereInput
  }

  /**
   * JournalEntry.trade
   */
  export type JournalEntry$tradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
  }

  /**
   * JournalEntry without action
   */
  export type JournalEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JournalEntry
     */
    select?: JournalEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JournalEntryInclude<ExtArgs> | null
  }


  /**
   * Model DailyPlan
   */

  export type AggregateDailyPlan = {
    _count: DailyPlanCountAggregateOutputType | null
    _avg: DailyPlanAvgAggregateOutputType | null
    _sum: DailyPlanSumAggregateOutputType | null
    _min: DailyPlanMinAggregateOutputType | null
    _max: DailyPlanMaxAggregateOutputType | null
  }

  export type DailyPlanAvgAggregateOutputType = {
    maxTrades: number | null
    disciplineScore: number | null
  }

  export type DailyPlanSumAggregateOutputType = {
    maxTrades: number | null
    disciplineScore: number | null
  }

  export type DailyPlanMinAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    macroBias: string | null
    keyLevels: string | null
    newsEvents: string | null
    sessionFocus: string | null
    maxTrades: number | null
    planNotes: string | null
    reviewNotes: string | null
    disciplineScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyPlanMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    macroBias: string | null
    keyLevels: string | null
    newsEvents: string | null
    sessionFocus: string | null
    maxTrades: number | null
    planNotes: string | null
    reviewNotes: string | null
    disciplineScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyPlanCountAggregateOutputType = {
    id: number
    userId: number
    date: number
    pairs: number
    macroBias: number
    keyLevels: number
    newsEvents: number
    sessionFocus: number
    maxTrades: number
    planNotes: number
    reviewNotes: number
    disciplineScore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DailyPlanAvgAggregateInputType = {
    maxTrades?: true
    disciplineScore?: true
  }

  export type DailyPlanSumAggregateInputType = {
    maxTrades?: true
    disciplineScore?: true
  }

  export type DailyPlanMinAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    macroBias?: true
    keyLevels?: true
    newsEvents?: true
    sessionFocus?: true
    maxTrades?: true
    planNotes?: true
    reviewNotes?: true
    disciplineScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyPlanMaxAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    macroBias?: true
    keyLevels?: true
    newsEvents?: true
    sessionFocus?: true
    maxTrades?: true
    planNotes?: true
    reviewNotes?: true
    disciplineScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyPlanCountAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    pairs?: true
    macroBias?: true
    keyLevels?: true
    newsEvents?: true
    sessionFocus?: true
    maxTrades?: true
    planNotes?: true
    reviewNotes?: true
    disciplineScore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DailyPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyPlan to aggregate.
     */
    where?: DailyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyPlans to fetch.
     */
    orderBy?: DailyPlanOrderByWithRelationInput | DailyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyPlans
    **/
    _count?: true | DailyPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyPlanMaxAggregateInputType
  }

  export type GetDailyPlanAggregateType<T extends DailyPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyPlan[P]>
      : GetScalarType<T[P], AggregateDailyPlan[P]>
  }




  export type DailyPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyPlanWhereInput
    orderBy?: DailyPlanOrderByWithAggregationInput | DailyPlanOrderByWithAggregationInput[]
    by: DailyPlanScalarFieldEnum[] | DailyPlanScalarFieldEnum
    having?: DailyPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyPlanCountAggregateInputType | true
    _avg?: DailyPlanAvgAggregateInputType
    _sum?: DailyPlanSumAggregateInputType
    _min?: DailyPlanMinAggregateInputType
    _max?: DailyPlanMaxAggregateInputType
  }

  export type DailyPlanGroupByOutputType = {
    id: string
    userId: string
    date: Date
    pairs: string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes: string | null
    reviewNotes: string | null
    disciplineScore: number | null
    createdAt: Date
    updatedAt: Date
    _count: DailyPlanCountAggregateOutputType | null
    _avg: DailyPlanAvgAggregateOutputType | null
    _sum: DailyPlanSumAggregateOutputType | null
    _min: DailyPlanMinAggregateOutputType | null
    _max: DailyPlanMaxAggregateOutputType | null
  }

  type GetDailyPlanGroupByPayload<T extends DailyPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyPlanGroupByOutputType[P]>
            : GetScalarType<T[P], DailyPlanGroupByOutputType[P]>
        }
      >
    >


  export type DailyPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    pairs?: boolean
    macroBias?: boolean
    keyLevels?: boolean
    newsEvents?: boolean
    sessionFocus?: boolean
    maxTrades?: boolean
    planNotes?: boolean
    reviewNotes?: boolean
    disciplineScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyPlan"]>

  export type DailyPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    pairs?: boolean
    macroBias?: boolean
    keyLevels?: boolean
    newsEvents?: boolean
    sessionFocus?: boolean
    maxTrades?: boolean
    planNotes?: boolean
    reviewNotes?: boolean
    disciplineScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyPlan"]>

  export type DailyPlanSelectScalar = {
    id?: boolean
    userId?: boolean
    date?: boolean
    pairs?: boolean
    macroBias?: boolean
    keyLevels?: boolean
    newsEvents?: boolean
    sessionFocus?: boolean
    maxTrades?: boolean
    planNotes?: boolean
    reviewNotes?: boolean
    disciplineScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DailyPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DailyPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyPlan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      date: Date
      pairs: string[]
      macroBias: string
      keyLevels: string
      newsEvents: string
      sessionFocus: string
      maxTrades: number
      planNotes: string | null
      reviewNotes: string | null
      disciplineScore: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dailyPlan"]>
    composites: {}
  }

  type DailyPlanGetPayload<S extends boolean | null | undefined | DailyPlanDefaultArgs> = $Result.GetResult<Prisma.$DailyPlanPayload, S>

  type DailyPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DailyPlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DailyPlanCountAggregateInputType | true
    }

  export interface DailyPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyPlan'], meta: { name: 'DailyPlan' } }
    /**
     * Find zero or one DailyPlan that matches the filter.
     * @param {DailyPlanFindUniqueArgs} args - Arguments to find a DailyPlan
     * @example
     * // Get one DailyPlan
     * const dailyPlan = await prisma.dailyPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyPlanFindUniqueArgs>(args: SelectSubset<T, DailyPlanFindUniqueArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DailyPlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DailyPlanFindUniqueOrThrowArgs} args - Arguments to find a DailyPlan
     * @example
     * // Get one DailyPlan
     * const dailyPlan = await prisma.dailyPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DailyPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanFindFirstArgs} args - Arguments to find a DailyPlan
     * @example
     * // Get one DailyPlan
     * const dailyPlan = await prisma.dailyPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyPlanFindFirstArgs>(args?: SelectSubset<T, DailyPlanFindFirstArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DailyPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanFindFirstOrThrowArgs} args - Arguments to find a DailyPlan
     * @example
     * // Get one DailyPlan
     * const dailyPlan = await prisma.dailyPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DailyPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyPlans
     * const dailyPlans = await prisma.dailyPlan.findMany()
     * 
     * // Get first 10 DailyPlans
     * const dailyPlans = await prisma.dailyPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyPlanWithIdOnly = await prisma.dailyPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyPlanFindManyArgs>(args?: SelectSubset<T, DailyPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DailyPlan.
     * @param {DailyPlanCreateArgs} args - Arguments to create a DailyPlan.
     * @example
     * // Create one DailyPlan
     * const DailyPlan = await prisma.dailyPlan.create({
     *   data: {
     *     // ... data to create a DailyPlan
     *   }
     * })
     * 
     */
    create<T extends DailyPlanCreateArgs>(args: SelectSubset<T, DailyPlanCreateArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DailyPlans.
     * @param {DailyPlanCreateManyArgs} args - Arguments to create many DailyPlans.
     * @example
     * // Create many DailyPlans
     * const dailyPlan = await prisma.dailyPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyPlanCreateManyArgs>(args?: SelectSubset<T, DailyPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyPlans and returns the data saved in the database.
     * @param {DailyPlanCreateManyAndReturnArgs} args - Arguments to create many DailyPlans.
     * @example
     * // Create many DailyPlans
     * const dailyPlan = await prisma.dailyPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyPlans and only return the `id`
     * const dailyPlanWithIdOnly = await prisma.dailyPlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DailyPlan.
     * @param {DailyPlanDeleteArgs} args - Arguments to delete one DailyPlan.
     * @example
     * // Delete one DailyPlan
     * const DailyPlan = await prisma.dailyPlan.delete({
     *   where: {
     *     // ... filter to delete one DailyPlan
     *   }
     * })
     * 
     */
    delete<T extends DailyPlanDeleteArgs>(args: SelectSubset<T, DailyPlanDeleteArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DailyPlan.
     * @param {DailyPlanUpdateArgs} args - Arguments to update one DailyPlan.
     * @example
     * // Update one DailyPlan
     * const dailyPlan = await prisma.dailyPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyPlanUpdateArgs>(args: SelectSubset<T, DailyPlanUpdateArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DailyPlans.
     * @param {DailyPlanDeleteManyArgs} args - Arguments to filter DailyPlans to delete.
     * @example
     * // Delete a few DailyPlans
     * const { count } = await prisma.dailyPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyPlanDeleteManyArgs>(args?: SelectSubset<T, DailyPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyPlans
     * const dailyPlan = await prisma.dailyPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyPlanUpdateManyArgs>(args: SelectSubset<T, DailyPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DailyPlan.
     * @param {DailyPlanUpsertArgs} args - Arguments to update or create a DailyPlan.
     * @example
     * // Update or create a DailyPlan
     * const dailyPlan = await prisma.dailyPlan.upsert({
     *   create: {
     *     // ... data to create a DailyPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyPlan we want to update
     *   }
     * })
     */
    upsert<T extends DailyPlanUpsertArgs>(args: SelectSubset<T, DailyPlanUpsertArgs<ExtArgs>>): Prisma__DailyPlanClient<$Result.GetResult<Prisma.$DailyPlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DailyPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanCountArgs} args - Arguments to filter DailyPlans to count.
     * @example
     * // Count the number of DailyPlans
     * const count = await prisma.dailyPlan.count({
     *   where: {
     *     // ... the filter for the DailyPlans we want to count
     *   }
     * })
    **/
    count<T extends DailyPlanCountArgs>(
      args?: Subset<T, DailyPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyPlanAggregateArgs>(args: Subset<T, DailyPlanAggregateArgs>): Prisma.PrismaPromise<GetDailyPlanAggregateType<T>>

    /**
     * Group by DailyPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyPlanGroupByArgs['orderBy'] }
        : { orderBy?: DailyPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyPlan model
   */
  readonly fields: DailyPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyPlan model
   */ 
  interface DailyPlanFieldRefs {
    readonly id: FieldRef<"DailyPlan", 'String'>
    readonly userId: FieldRef<"DailyPlan", 'String'>
    readonly date: FieldRef<"DailyPlan", 'DateTime'>
    readonly pairs: FieldRef<"DailyPlan", 'String[]'>
    readonly macroBias: FieldRef<"DailyPlan", 'String'>
    readonly keyLevels: FieldRef<"DailyPlan", 'String'>
    readonly newsEvents: FieldRef<"DailyPlan", 'String'>
    readonly sessionFocus: FieldRef<"DailyPlan", 'String'>
    readonly maxTrades: FieldRef<"DailyPlan", 'Int'>
    readonly planNotes: FieldRef<"DailyPlan", 'String'>
    readonly reviewNotes: FieldRef<"DailyPlan", 'String'>
    readonly disciplineScore: FieldRef<"DailyPlan", 'Int'>
    readonly createdAt: FieldRef<"DailyPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"DailyPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyPlan findUnique
   */
  export type DailyPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter, which DailyPlan to fetch.
     */
    where: DailyPlanWhereUniqueInput
  }

  /**
   * DailyPlan findUniqueOrThrow
   */
  export type DailyPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter, which DailyPlan to fetch.
     */
    where: DailyPlanWhereUniqueInput
  }

  /**
   * DailyPlan findFirst
   */
  export type DailyPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter, which DailyPlan to fetch.
     */
    where?: DailyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyPlans to fetch.
     */
    orderBy?: DailyPlanOrderByWithRelationInput | DailyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyPlans.
     */
    cursor?: DailyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyPlans.
     */
    distinct?: DailyPlanScalarFieldEnum | DailyPlanScalarFieldEnum[]
  }

  /**
   * DailyPlan findFirstOrThrow
   */
  export type DailyPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter, which DailyPlan to fetch.
     */
    where?: DailyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyPlans to fetch.
     */
    orderBy?: DailyPlanOrderByWithRelationInput | DailyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyPlans.
     */
    cursor?: DailyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyPlans.
     */
    distinct?: DailyPlanScalarFieldEnum | DailyPlanScalarFieldEnum[]
  }

  /**
   * DailyPlan findMany
   */
  export type DailyPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter, which DailyPlans to fetch.
     */
    where?: DailyPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyPlans to fetch.
     */
    orderBy?: DailyPlanOrderByWithRelationInput | DailyPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyPlans.
     */
    cursor?: DailyPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyPlans.
     */
    skip?: number
    distinct?: DailyPlanScalarFieldEnum | DailyPlanScalarFieldEnum[]
  }

  /**
   * DailyPlan create
   */
  export type DailyPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyPlan.
     */
    data: XOR<DailyPlanCreateInput, DailyPlanUncheckedCreateInput>
  }

  /**
   * DailyPlan createMany
   */
  export type DailyPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyPlans.
     */
    data: DailyPlanCreateManyInput | DailyPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyPlan createManyAndReturn
   */
  export type DailyPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DailyPlans.
     */
    data: DailyPlanCreateManyInput | DailyPlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyPlan update
   */
  export type DailyPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyPlan.
     */
    data: XOR<DailyPlanUpdateInput, DailyPlanUncheckedUpdateInput>
    /**
     * Choose, which DailyPlan to update.
     */
    where: DailyPlanWhereUniqueInput
  }

  /**
   * DailyPlan updateMany
   */
  export type DailyPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyPlans.
     */
    data: XOR<DailyPlanUpdateManyMutationInput, DailyPlanUncheckedUpdateManyInput>
    /**
     * Filter which DailyPlans to update
     */
    where?: DailyPlanWhereInput
  }

  /**
   * DailyPlan upsert
   */
  export type DailyPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyPlan to update in case it exists.
     */
    where: DailyPlanWhereUniqueInput
    /**
     * In case the DailyPlan found by the `where` argument doesn't exist, create a new DailyPlan with this data.
     */
    create: XOR<DailyPlanCreateInput, DailyPlanUncheckedCreateInput>
    /**
     * In case the DailyPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyPlanUpdateInput, DailyPlanUncheckedUpdateInput>
  }

  /**
   * DailyPlan delete
   */
  export type DailyPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
    /**
     * Filter which DailyPlan to delete.
     */
    where: DailyPlanWhereUniqueInput
  }

  /**
   * DailyPlan deleteMany
   */
  export type DailyPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyPlans to delete
     */
    where?: DailyPlanWhereInput
  }

  /**
   * DailyPlan without action
   */
  export type DailyPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyPlan
     */
    select?: DailyPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyPlanInclude<ExtArgs> | null
  }


  /**
   * Model NewsEvent
   */

  export type AggregateNewsEvent = {
    _count: NewsEventCountAggregateOutputType | null
    _min: NewsEventMinAggregateOutputType | null
    _max: NewsEventMaxAggregateOutputType | null
  }

  export type NewsEventMinAggregateOutputType = {
    id: string | null
    time: Date | null
    currency: string | null
    event: string | null
    impact: $Enums.NewsImpact | null
    forecast: string | null
    previous: string | null
    actual: string | null
    fetchedAt: Date | null
  }

  export type NewsEventMaxAggregateOutputType = {
    id: string | null
    time: Date | null
    currency: string | null
    event: string | null
    impact: $Enums.NewsImpact | null
    forecast: string | null
    previous: string | null
    actual: string | null
    fetchedAt: Date | null
  }

  export type NewsEventCountAggregateOutputType = {
    id: number
    time: number
    currency: number
    event: number
    impact: number
    forecast: number
    previous: number
    actual: number
    fetchedAt: number
    _all: number
  }


  export type NewsEventMinAggregateInputType = {
    id?: true
    time?: true
    currency?: true
    event?: true
    impact?: true
    forecast?: true
    previous?: true
    actual?: true
    fetchedAt?: true
  }

  export type NewsEventMaxAggregateInputType = {
    id?: true
    time?: true
    currency?: true
    event?: true
    impact?: true
    forecast?: true
    previous?: true
    actual?: true
    fetchedAt?: true
  }

  export type NewsEventCountAggregateInputType = {
    id?: true
    time?: true
    currency?: true
    event?: true
    impact?: true
    forecast?: true
    previous?: true
    actual?: true
    fetchedAt?: true
    _all?: true
  }

  export type NewsEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsEvent to aggregate.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsEvents
    **/
    _count?: true | NewsEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsEventMaxAggregateInputType
  }

  export type GetNewsEventAggregateType<T extends NewsEventAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsEvent[P]>
      : GetScalarType<T[P], AggregateNewsEvent[P]>
  }




  export type NewsEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsEventWhereInput
    orderBy?: NewsEventOrderByWithAggregationInput | NewsEventOrderByWithAggregationInput[]
    by: NewsEventScalarFieldEnum[] | NewsEventScalarFieldEnum
    having?: NewsEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsEventCountAggregateInputType | true
    _min?: NewsEventMinAggregateInputType
    _max?: NewsEventMaxAggregateInputType
  }

  export type NewsEventGroupByOutputType = {
    id: string
    time: Date
    currency: string
    event: string
    impact: $Enums.NewsImpact
    forecast: string | null
    previous: string | null
    actual: string | null
    fetchedAt: Date
    _count: NewsEventCountAggregateOutputType | null
    _min: NewsEventMinAggregateOutputType | null
    _max: NewsEventMaxAggregateOutputType | null
  }

  type GetNewsEventGroupByPayload<T extends NewsEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsEventGroupByOutputType[P]>
            : GetScalarType<T[P], NewsEventGroupByOutputType[P]>
        }
      >
    >


  export type NewsEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    currency?: boolean
    event?: boolean
    impact?: boolean
    forecast?: boolean
    previous?: boolean
    actual?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["newsEvent"]>

  export type NewsEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    currency?: boolean
    event?: boolean
    impact?: boolean
    forecast?: boolean
    previous?: boolean
    actual?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["newsEvent"]>

  export type NewsEventSelectScalar = {
    id?: boolean
    time?: boolean
    currency?: boolean
    event?: boolean
    impact?: boolean
    forecast?: boolean
    previous?: boolean
    actual?: boolean
    fetchedAt?: boolean
  }


  export type $NewsEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      time: Date
      currency: string
      event: string
      impact: $Enums.NewsImpact
      forecast: string | null
      previous: string | null
      actual: string | null
      fetchedAt: Date
    }, ExtArgs["result"]["newsEvent"]>
    composites: {}
  }

  type NewsEventGetPayload<S extends boolean | null | undefined | NewsEventDefaultArgs> = $Result.GetResult<Prisma.$NewsEventPayload, S>

  type NewsEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NewsEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NewsEventCountAggregateInputType | true
    }

  export interface NewsEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsEvent'], meta: { name: 'NewsEvent' } }
    /**
     * Find zero or one NewsEvent that matches the filter.
     * @param {NewsEventFindUniqueArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsEventFindUniqueArgs>(args: SelectSubset<T, NewsEventFindUniqueArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NewsEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NewsEventFindUniqueOrThrowArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsEventFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NewsEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindFirstArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsEventFindFirstArgs>(args?: SelectSubset<T, NewsEventFindFirstArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NewsEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindFirstOrThrowArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsEventFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NewsEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsEvents
     * const newsEvents = await prisma.newsEvent.findMany()
     * 
     * // Get first 10 NewsEvents
     * const newsEvents = await prisma.newsEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsEventWithIdOnly = await prisma.newsEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsEventFindManyArgs>(args?: SelectSubset<T, NewsEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NewsEvent.
     * @param {NewsEventCreateArgs} args - Arguments to create a NewsEvent.
     * @example
     * // Create one NewsEvent
     * const NewsEvent = await prisma.newsEvent.create({
     *   data: {
     *     // ... data to create a NewsEvent
     *   }
     * })
     * 
     */
    create<T extends NewsEventCreateArgs>(args: SelectSubset<T, NewsEventCreateArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NewsEvents.
     * @param {NewsEventCreateManyArgs} args - Arguments to create many NewsEvents.
     * @example
     * // Create many NewsEvents
     * const newsEvent = await prisma.newsEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsEventCreateManyArgs>(args?: SelectSubset<T, NewsEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsEvents and returns the data saved in the database.
     * @param {NewsEventCreateManyAndReturnArgs} args - Arguments to create many NewsEvents.
     * @example
     * // Create many NewsEvents
     * const newsEvent = await prisma.newsEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsEvents and only return the `id`
     * const newsEventWithIdOnly = await prisma.newsEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsEventCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NewsEvent.
     * @param {NewsEventDeleteArgs} args - Arguments to delete one NewsEvent.
     * @example
     * // Delete one NewsEvent
     * const NewsEvent = await prisma.newsEvent.delete({
     *   where: {
     *     // ... filter to delete one NewsEvent
     *   }
     * })
     * 
     */
    delete<T extends NewsEventDeleteArgs>(args: SelectSubset<T, NewsEventDeleteArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NewsEvent.
     * @param {NewsEventUpdateArgs} args - Arguments to update one NewsEvent.
     * @example
     * // Update one NewsEvent
     * const newsEvent = await prisma.newsEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsEventUpdateArgs>(args: SelectSubset<T, NewsEventUpdateArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NewsEvents.
     * @param {NewsEventDeleteManyArgs} args - Arguments to filter NewsEvents to delete.
     * @example
     * // Delete a few NewsEvents
     * const { count } = await prisma.newsEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsEventDeleteManyArgs>(args?: SelectSubset<T, NewsEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsEvents
     * const newsEvent = await prisma.newsEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsEventUpdateManyArgs>(args: SelectSubset<T, NewsEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsEvent.
     * @param {NewsEventUpsertArgs} args - Arguments to update or create a NewsEvent.
     * @example
     * // Update or create a NewsEvent
     * const newsEvent = await prisma.newsEvent.upsert({
     *   create: {
     *     // ... data to create a NewsEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsEvent we want to update
     *   }
     * })
     */
    upsert<T extends NewsEventUpsertArgs>(args: SelectSubset<T, NewsEventUpsertArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NewsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventCountArgs} args - Arguments to filter NewsEvents to count.
     * @example
     * // Count the number of NewsEvents
     * const count = await prisma.newsEvent.count({
     *   where: {
     *     // ... the filter for the NewsEvents we want to count
     *   }
     * })
    **/
    count<T extends NewsEventCountArgs>(
      args?: Subset<T, NewsEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsEventAggregateArgs>(args: Subset<T, NewsEventAggregateArgs>): Prisma.PrismaPromise<GetNewsEventAggregateType<T>>

    /**
     * Group by NewsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsEventGroupByArgs['orderBy'] }
        : { orderBy?: NewsEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsEvent model
   */
  readonly fields: NewsEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsEvent model
   */ 
  interface NewsEventFieldRefs {
    readonly id: FieldRef<"NewsEvent", 'String'>
    readonly time: FieldRef<"NewsEvent", 'DateTime'>
    readonly currency: FieldRef<"NewsEvent", 'String'>
    readonly event: FieldRef<"NewsEvent", 'String'>
    readonly impact: FieldRef<"NewsEvent", 'NewsImpact'>
    readonly forecast: FieldRef<"NewsEvent", 'String'>
    readonly previous: FieldRef<"NewsEvent", 'String'>
    readonly actual: FieldRef<"NewsEvent", 'String'>
    readonly fetchedAt: FieldRef<"NewsEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsEvent findUnique
   */
  export type NewsEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent findUniqueOrThrow
   */
  export type NewsEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent findFirst
   */
  export type NewsEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsEvents.
     */
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent findFirstOrThrow
   */
  export type NewsEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsEvents.
     */
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent findMany
   */
  export type NewsEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter, which NewsEvents to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent create
   */
  export type NewsEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * The data needed to create a NewsEvent.
     */
    data: XOR<NewsEventCreateInput, NewsEventUncheckedCreateInput>
  }

  /**
   * NewsEvent createMany
   */
  export type NewsEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsEvents.
     */
    data: NewsEventCreateManyInput | NewsEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsEvent createManyAndReturn
   */
  export type NewsEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NewsEvents.
     */
    data: NewsEventCreateManyInput | NewsEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsEvent update
   */
  export type NewsEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * The data needed to update a NewsEvent.
     */
    data: XOR<NewsEventUpdateInput, NewsEventUncheckedUpdateInput>
    /**
     * Choose, which NewsEvent to update.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent updateMany
   */
  export type NewsEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsEvents.
     */
    data: XOR<NewsEventUpdateManyMutationInput, NewsEventUncheckedUpdateManyInput>
    /**
     * Filter which NewsEvents to update
     */
    where?: NewsEventWhereInput
  }

  /**
   * NewsEvent upsert
   */
  export type NewsEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * The filter to search for the NewsEvent to update in case it exists.
     */
    where: NewsEventWhereUniqueInput
    /**
     * In case the NewsEvent found by the `where` argument doesn't exist, create a new NewsEvent with this data.
     */
    create: XOR<NewsEventCreateInput, NewsEventUncheckedCreateInput>
    /**
     * In case the NewsEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsEventUpdateInput, NewsEventUncheckedUpdateInput>
  }

  /**
   * NewsEvent delete
   */
  export type NewsEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Filter which NewsEvent to delete.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent deleteMany
   */
  export type NewsEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsEvents to delete
     */
    where?: NewsEventWhereInput
  }

  /**
   * NewsEvent without action
   */
  export type NewsEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
  }


  /**
   * Model AlertLog
   */

  export type AggregateAlertLog = {
    _count: AlertLogCountAggregateOutputType | null
    _avg: AlertLogAvgAggregateOutputType | null
    _sum: AlertLogSumAggregateOutputType | null
    _min: AlertLogMinAggregateOutputType | null
    _max: AlertLogMaxAggregateOutputType | null
  }

  export type AlertLogAvgAggregateOutputType = {
    score: number | null
  }

  export type AlertLogSumAggregateOutputType = {
    score: number | null
  }

  export type AlertLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    pair: string | null
    alertType: string | null
    score: number | null
    session: string | null
    direction: string | null
    channel: string | null
    sentAt: Date | null
  }

  export type AlertLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    pair: string | null
    alertType: string | null
    score: number | null
    session: string | null
    direction: string | null
    channel: string | null
    sentAt: Date | null
  }

  export type AlertLogCountAggregateOutputType = {
    id: number
    userId: number
    pair: number
    alertType: number
    score: number
    session: number
    direction: number
    channel: number
    sentAt: number
    _all: number
  }


  export type AlertLogAvgAggregateInputType = {
    score?: true
  }

  export type AlertLogSumAggregateInputType = {
    score?: true
  }

  export type AlertLogMinAggregateInputType = {
    id?: true
    userId?: true
    pair?: true
    alertType?: true
    score?: true
    session?: true
    direction?: true
    channel?: true
    sentAt?: true
  }

  export type AlertLogMaxAggregateInputType = {
    id?: true
    userId?: true
    pair?: true
    alertType?: true
    score?: true
    session?: true
    direction?: true
    channel?: true
    sentAt?: true
  }

  export type AlertLogCountAggregateInputType = {
    id?: true
    userId?: true
    pair?: true
    alertType?: true
    score?: true
    session?: true
    direction?: true
    channel?: true
    sentAt?: true
    _all?: true
  }

  export type AlertLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertLog to aggregate.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlertLogs
    **/
    _count?: true | AlertLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlertLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlertLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertLogMaxAggregateInputType
  }

  export type GetAlertLogAggregateType<T extends AlertLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAlertLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlertLog[P]>
      : GetScalarType<T[P], AggregateAlertLog[P]>
  }




  export type AlertLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertLogWhereInput
    orderBy?: AlertLogOrderByWithAggregationInput | AlertLogOrderByWithAggregationInput[]
    by: AlertLogScalarFieldEnum[] | AlertLogScalarFieldEnum
    having?: AlertLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertLogCountAggregateInputType | true
    _avg?: AlertLogAvgAggregateInputType
    _sum?: AlertLogSumAggregateInputType
    _min?: AlertLogMinAggregateInputType
    _max?: AlertLogMaxAggregateInputType
  }

  export type AlertLogGroupByOutputType = {
    id: string
    userId: string
    pair: string
    alertType: string
    score: number
    session: string
    direction: string | null
    channel: string
    sentAt: Date
    _count: AlertLogCountAggregateOutputType | null
    _avg: AlertLogAvgAggregateOutputType | null
    _sum: AlertLogSumAggregateOutputType | null
    _min: AlertLogMinAggregateOutputType | null
    _max: AlertLogMaxAggregateOutputType | null
  }

  type GetAlertLogGroupByPayload<T extends AlertLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertLogGroupByOutputType[P]>
            : GetScalarType<T[P], AlertLogGroupByOutputType[P]>
        }
      >
    >


  export type AlertLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pair?: boolean
    alertType?: boolean
    score?: boolean
    session?: boolean
    direction?: boolean
    channel?: boolean
    sentAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    trades?: boolean | AlertLog$tradesArgs<ExtArgs>
    _count?: boolean | AlertLogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alertLog"]>

  export type AlertLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pair?: boolean
    alertType?: boolean
    score?: boolean
    session?: boolean
    direction?: boolean
    channel?: boolean
    sentAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alertLog"]>

  export type AlertLogSelectScalar = {
    id?: boolean
    userId?: boolean
    pair?: boolean
    alertType?: boolean
    score?: boolean
    session?: boolean
    direction?: boolean
    channel?: boolean
    sentAt?: boolean
  }

  export type AlertLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    trades?: boolean | AlertLog$tradesArgs<ExtArgs>
    _count?: boolean | AlertLogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlertLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AlertLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlertLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      trades: Prisma.$TradePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      pair: string
      alertType: string
      score: number
      session: string
      direction: string | null
      channel: string
      sentAt: Date
    }, ExtArgs["result"]["alertLog"]>
    composites: {}
  }

  type AlertLogGetPayload<S extends boolean | null | undefined | AlertLogDefaultArgs> = $Result.GetResult<Prisma.$AlertLogPayload, S>

  type AlertLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlertLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlertLogCountAggregateInputType | true
    }

  export interface AlertLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlertLog'], meta: { name: 'AlertLog' } }
    /**
     * Find zero or one AlertLog that matches the filter.
     * @param {AlertLogFindUniqueArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertLogFindUniqueArgs>(args: SelectSubset<T, AlertLogFindUniqueArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlertLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlertLogFindUniqueOrThrowArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlertLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindFirstArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertLogFindFirstArgs>(args?: SelectSubset<T, AlertLogFindFirstArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlertLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindFirstOrThrowArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlertLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlertLogs
     * const alertLogs = await prisma.alertLog.findMany()
     * 
     * // Get first 10 AlertLogs
     * const alertLogs = await prisma.alertLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertLogWithIdOnly = await prisma.alertLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertLogFindManyArgs>(args?: SelectSubset<T, AlertLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlertLog.
     * @param {AlertLogCreateArgs} args - Arguments to create a AlertLog.
     * @example
     * // Create one AlertLog
     * const AlertLog = await prisma.alertLog.create({
     *   data: {
     *     // ... data to create a AlertLog
     *   }
     * })
     * 
     */
    create<T extends AlertLogCreateArgs>(args: SelectSubset<T, AlertLogCreateArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlertLogs.
     * @param {AlertLogCreateManyArgs} args - Arguments to create many AlertLogs.
     * @example
     * // Create many AlertLogs
     * const alertLog = await prisma.alertLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertLogCreateManyArgs>(args?: SelectSubset<T, AlertLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AlertLogs and returns the data saved in the database.
     * @param {AlertLogCreateManyAndReturnArgs} args - Arguments to create many AlertLogs.
     * @example
     * // Create many AlertLogs
     * const alertLog = await prisma.alertLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AlertLogs and only return the `id`
     * const alertLogWithIdOnly = await prisma.alertLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlertLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AlertLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AlertLog.
     * @param {AlertLogDeleteArgs} args - Arguments to delete one AlertLog.
     * @example
     * // Delete one AlertLog
     * const AlertLog = await prisma.alertLog.delete({
     *   where: {
     *     // ... filter to delete one AlertLog
     *   }
     * })
     * 
     */
    delete<T extends AlertLogDeleteArgs>(args: SelectSubset<T, AlertLogDeleteArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlertLog.
     * @param {AlertLogUpdateArgs} args - Arguments to update one AlertLog.
     * @example
     * // Update one AlertLog
     * const alertLog = await prisma.alertLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertLogUpdateArgs>(args: SelectSubset<T, AlertLogUpdateArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlertLogs.
     * @param {AlertLogDeleteManyArgs} args - Arguments to filter AlertLogs to delete.
     * @example
     * // Delete a few AlertLogs
     * const { count } = await prisma.alertLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertLogDeleteManyArgs>(args?: SelectSubset<T, AlertLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlertLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlertLogs
     * const alertLog = await prisma.alertLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertLogUpdateManyArgs>(args: SelectSubset<T, AlertLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlertLog.
     * @param {AlertLogUpsertArgs} args - Arguments to update or create a AlertLog.
     * @example
     * // Update or create a AlertLog
     * const alertLog = await prisma.alertLog.upsert({
     *   create: {
     *     // ... data to create a AlertLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlertLog we want to update
     *   }
     * })
     */
    upsert<T extends AlertLogUpsertArgs>(args: SelectSubset<T, AlertLogUpsertArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlertLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogCountArgs} args - Arguments to filter AlertLogs to count.
     * @example
     * // Count the number of AlertLogs
     * const count = await prisma.alertLog.count({
     *   where: {
     *     // ... the filter for the AlertLogs we want to count
     *   }
     * })
    **/
    count<T extends AlertLogCountArgs>(
      args?: Subset<T, AlertLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlertLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlertLogAggregateArgs>(args: Subset<T, AlertLogAggregateArgs>): Prisma.PrismaPromise<GetAlertLogAggregateType<T>>

    /**
     * Group by AlertLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlertLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertLogGroupByArgs['orderBy'] }
        : { orderBy?: AlertLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlertLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlertLog model
   */
  readonly fields: AlertLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlertLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    trades<T extends AlertLog$tradesArgs<ExtArgs> = {}>(args?: Subset<T, AlertLog$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AlertLog model
   */ 
  interface AlertLogFieldRefs {
    readonly id: FieldRef<"AlertLog", 'String'>
    readonly userId: FieldRef<"AlertLog", 'String'>
    readonly pair: FieldRef<"AlertLog", 'String'>
    readonly alertType: FieldRef<"AlertLog", 'String'>
    readonly score: FieldRef<"AlertLog", 'Int'>
    readonly session: FieldRef<"AlertLog", 'String'>
    readonly direction: FieldRef<"AlertLog", 'String'>
    readonly channel: FieldRef<"AlertLog", 'String'>
    readonly sentAt: FieldRef<"AlertLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlertLog findUnique
   */
  export type AlertLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog findUniqueOrThrow
   */
  export type AlertLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog findFirst
   */
  export type AlertLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertLogs.
     */
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog findFirstOrThrow
   */
  export type AlertLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertLogs.
     */
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog findMany
   */
  export type AlertLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter, which AlertLogs to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog create
   */
  export type AlertLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AlertLog.
     */
    data: XOR<AlertLogCreateInput, AlertLogUncheckedCreateInput>
  }

  /**
   * AlertLog createMany
   */
  export type AlertLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlertLogs.
     */
    data: AlertLogCreateManyInput | AlertLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlertLog createManyAndReturn
   */
  export type AlertLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AlertLogs.
     */
    data: AlertLogCreateManyInput | AlertLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AlertLog update
   */
  export type AlertLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AlertLog.
     */
    data: XOR<AlertLogUpdateInput, AlertLogUncheckedUpdateInput>
    /**
     * Choose, which AlertLog to update.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog updateMany
   */
  export type AlertLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlertLogs.
     */
    data: XOR<AlertLogUpdateManyMutationInput, AlertLogUncheckedUpdateManyInput>
    /**
     * Filter which AlertLogs to update
     */
    where?: AlertLogWhereInput
  }

  /**
   * AlertLog upsert
   */
  export type AlertLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AlertLog to update in case it exists.
     */
    where: AlertLogWhereUniqueInput
    /**
     * In case the AlertLog found by the `where` argument doesn't exist, create a new AlertLog with this data.
     */
    create: XOR<AlertLogCreateInput, AlertLogUncheckedCreateInput>
    /**
     * In case the AlertLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertLogUpdateInput, AlertLogUncheckedUpdateInput>
  }

  /**
   * AlertLog delete
   */
  export type AlertLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
    /**
     * Filter which AlertLog to delete.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog deleteMany
   */
  export type AlertLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertLogs to delete
     */
    where?: AlertLogWhereInput
  }

  /**
   * AlertLog.trades
   */
  export type AlertLog$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    cursor?: TradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * AlertLog without action
   */
  export type AlertLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertLogInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisCache
   */

  export type AggregateAnalysisCache = {
    _count: AnalysisCacheCountAggregateOutputType | null
    _min: AnalysisCacheMinAggregateOutputType | null
    _max: AnalysisCacheMaxAggregateOutputType | null
  }

  export type AnalysisCacheMinAggregateOutputType = {
    id: string | null
    pair: string | null
    analysis: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AnalysisCacheMaxAggregateOutputType = {
    id: string | null
    pair: string | null
    analysis: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AnalysisCacheCountAggregateOutputType = {
    id: number
    pair: number
    analysis: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type AnalysisCacheMinAggregateInputType = {
    id?: true
    pair?: true
    analysis?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AnalysisCacheMaxAggregateInputType = {
    id?: true
    pair?: true
    analysis?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AnalysisCacheCountAggregateInputType = {
    id?: true
    pair?: true
    analysis?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type AnalysisCacheAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisCache to aggregate.
     */
    where?: AnalysisCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisCaches to fetch.
     */
    orderBy?: AnalysisCacheOrderByWithRelationInput | AnalysisCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisCaches
    **/
    _count?: true | AnalysisCacheCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisCacheMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisCacheMaxAggregateInputType
  }

  export type GetAnalysisCacheAggregateType<T extends AnalysisCacheAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisCache]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisCache[P]>
      : GetScalarType<T[P], AggregateAnalysisCache[P]>
  }




  export type AnalysisCacheGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisCacheWhereInput
    orderBy?: AnalysisCacheOrderByWithAggregationInput | AnalysisCacheOrderByWithAggregationInput[]
    by: AnalysisCacheScalarFieldEnum[] | AnalysisCacheScalarFieldEnum
    having?: AnalysisCacheScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisCacheCountAggregateInputType | true
    _min?: AnalysisCacheMinAggregateInputType
    _max?: AnalysisCacheMaxAggregateInputType
  }

  export type AnalysisCacheGroupByOutputType = {
    id: string
    pair: string
    analysis: string
    createdAt: Date
    expiresAt: Date
    _count: AnalysisCacheCountAggregateOutputType | null
    _min: AnalysisCacheMinAggregateOutputType | null
    _max: AnalysisCacheMaxAggregateOutputType | null
  }

  type GetAnalysisCacheGroupByPayload<T extends AnalysisCacheGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisCacheGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisCacheGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisCacheGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisCacheGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisCacheSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pair?: boolean
    analysis?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["analysisCache"]>

  export type AnalysisCacheSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pair?: boolean
    analysis?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["analysisCache"]>

  export type AnalysisCacheSelectScalar = {
    id?: boolean
    pair?: boolean
    analysis?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }


  export type $AnalysisCachePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisCache"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pair: string
      analysis: string
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["analysisCache"]>
    composites: {}
  }

  type AnalysisCacheGetPayload<S extends boolean | null | undefined | AnalysisCacheDefaultArgs> = $Result.GetResult<Prisma.$AnalysisCachePayload, S>

  type AnalysisCacheCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnalysisCacheFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnalysisCacheCountAggregateInputType | true
    }

  export interface AnalysisCacheDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisCache'], meta: { name: 'AnalysisCache' } }
    /**
     * Find zero or one AnalysisCache that matches the filter.
     * @param {AnalysisCacheFindUniqueArgs} args - Arguments to find a AnalysisCache
     * @example
     * // Get one AnalysisCache
     * const analysisCache = await prisma.analysisCache.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisCacheFindUniqueArgs>(args: SelectSubset<T, AnalysisCacheFindUniqueArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnalysisCache that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnalysisCacheFindUniqueOrThrowArgs} args - Arguments to find a AnalysisCache
     * @example
     * // Get one AnalysisCache
     * const analysisCache = await prisma.analysisCache.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisCacheFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnalysisCache that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheFindFirstArgs} args - Arguments to find a AnalysisCache
     * @example
     * // Get one AnalysisCache
     * const analysisCache = await prisma.analysisCache.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisCacheFindFirstArgs>(args?: SelectSubset<T, AnalysisCacheFindFirstArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnalysisCache that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheFindFirstOrThrowArgs} args - Arguments to find a AnalysisCache
     * @example
     * // Get one AnalysisCache
     * const analysisCache = await prisma.analysisCache.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisCacheFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnalysisCaches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisCaches
     * const analysisCaches = await prisma.analysisCache.findMany()
     * 
     * // Get first 10 AnalysisCaches
     * const analysisCaches = await prisma.analysisCache.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisCacheWithIdOnly = await prisma.analysisCache.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisCacheFindManyArgs>(args?: SelectSubset<T, AnalysisCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnalysisCache.
     * @param {AnalysisCacheCreateArgs} args - Arguments to create a AnalysisCache.
     * @example
     * // Create one AnalysisCache
     * const AnalysisCache = await prisma.analysisCache.create({
     *   data: {
     *     // ... data to create a AnalysisCache
     *   }
     * })
     * 
     */
    create<T extends AnalysisCacheCreateArgs>(args: SelectSubset<T, AnalysisCacheCreateArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnalysisCaches.
     * @param {AnalysisCacheCreateManyArgs} args - Arguments to create many AnalysisCaches.
     * @example
     * // Create many AnalysisCaches
     * const analysisCache = await prisma.analysisCache.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisCacheCreateManyArgs>(args?: SelectSubset<T, AnalysisCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisCaches and returns the data saved in the database.
     * @param {AnalysisCacheCreateManyAndReturnArgs} args - Arguments to create many AnalysisCaches.
     * @example
     * // Create many AnalysisCaches
     * const analysisCache = await prisma.analysisCache.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisCaches and only return the `id`
     * const analysisCacheWithIdOnly = await prisma.analysisCache.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisCacheCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnalysisCache.
     * @param {AnalysisCacheDeleteArgs} args - Arguments to delete one AnalysisCache.
     * @example
     * // Delete one AnalysisCache
     * const AnalysisCache = await prisma.analysisCache.delete({
     *   where: {
     *     // ... filter to delete one AnalysisCache
     *   }
     * })
     * 
     */
    delete<T extends AnalysisCacheDeleteArgs>(args: SelectSubset<T, AnalysisCacheDeleteArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnalysisCache.
     * @param {AnalysisCacheUpdateArgs} args - Arguments to update one AnalysisCache.
     * @example
     * // Update one AnalysisCache
     * const analysisCache = await prisma.analysisCache.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisCacheUpdateArgs>(args: SelectSubset<T, AnalysisCacheUpdateArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnalysisCaches.
     * @param {AnalysisCacheDeleteManyArgs} args - Arguments to filter AnalysisCaches to delete.
     * @example
     * // Delete a few AnalysisCaches
     * const { count } = await prisma.analysisCache.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisCacheDeleteManyArgs>(args?: SelectSubset<T, AnalysisCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisCaches
     * const analysisCache = await prisma.analysisCache.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisCacheUpdateManyArgs>(args: SelectSubset<T, AnalysisCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnalysisCache.
     * @param {AnalysisCacheUpsertArgs} args - Arguments to update or create a AnalysisCache.
     * @example
     * // Update or create a AnalysisCache
     * const analysisCache = await prisma.analysisCache.upsert({
     *   create: {
     *     // ... data to create a AnalysisCache
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisCache we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisCacheUpsertArgs>(args: SelectSubset<T, AnalysisCacheUpsertArgs<ExtArgs>>): Prisma__AnalysisCacheClient<$Result.GetResult<Prisma.$AnalysisCachePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnalysisCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheCountArgs} args - Arguments to filter AnalysisCaches to count.
     * @example
     * // Count the number of AnalysisCaches
     * const count = await prisma.analysisCache.count({
     *   where: {
     *     // ... the filter for the AnalysisCaches we want to count
     *   }
     * })
    **/
    count<T extends AnalysisCacheCountArgs>(
      args?: Subset<T, AnalysisCacheCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisCacheCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisCacheAggregateArgs>(args: Subset<T, AnalysisCacheAggregateArgs>): Prisma.PrismaPromise<GetAnalysisCacheAggregateType<T>>

    /**
     * Group by AnalysisCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCacheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisCacheGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisCacheGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisCacheGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisCache model
   */
  readonly fields: AnalysisCacheFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisCache.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisCacheClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisCache model
   */ 
  interface AnalysisCacheFieldRefs {
    readonly id: FieldRef<"AnalysisCache", 'String'>
    readonly pair: FieldRef<"AnalysisCache", 'String'>
    readonly analysis: FieldRef<"AnalysisCache", 'String'>
    readonly createdAt: FieldRef<"AnalysisCache", 'DateTime'>
    readonly expiresAt: FieldRef<"AnalysisCache", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisCache findUnique
   */
  export type AnalysisCacheFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter, which AnalysisCache to fetch.
     */
    where: AnalysisCacheWhereUniqueInput
  }

  /**
   * AnalysisCache findUniqueOrThrow
   */
  export type AnalysisCacheFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter, which AnalysisCache to fetch.
     */
    where: AnalysisCacheWhereUniqueInput
  }

  /**
   * AnalysisCache findFirst
   */
  export type AnalysisCacheFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter, which AnalysisCache to fetch.
     */
    where?: AnalysisCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisCaches to fetch.
     */
    orderBy?: AnalysisCacheOrderByWithRelationInput | AnalysisCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisCaches.
     */
    cursor?: AnalysisCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisCaches.
     */
    distinct?: AnalysisCacheScalarFieldEnum | AnalysisCacheScalarFieldEnum[]
  }

  /**
   * AnalysisCache findFirstOrThrow
   */
  export type AnalysisCacheFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter, which AnalysisCache to fetch.
     */
    where?: AnalysisCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisCaches to fetch.
     */
    orderBy?: AnalysisCacheOrderByWithRelationInput | AnalysisCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisCaches.
     */
    cursor?: AnalysisCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisCaches.
     */
    distinct?: AnalysisCacheScalarFieldEnum | AnalysisCacheScalarFieldEnum[]
  }

  /**
   * AnalysisCache findMany
   */
  export type AnalysisCacheFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter, which AnalysisCaches to fetch.
     */
    where?: AnalysisCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisCaches to fetch.
     */
    orderBy?: AnalysisCacheOrderByWithRelationInput | AnalysisCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisCaches.
     */
    cursor?: AnalysisCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisCaches.
     */
    skip?: number
    distinct?: AnalysisCacheScalarFieldEnum | AnalysisCacheScalarFieldEnum[]
  }

  /**
   * AnalysisCache create
   */
  export type AnalysisCacheCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * The data needed to create a AnalysisCache.
     */
    data: XOR<AnalysisCacheCreateInput, AnalysisCacheUncheckedCreateInput>
  }

  /**
   * AnalysisCache createMany
   */
  export type AnalysisCacheCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisCaches.
     */
    data: AnalysisCacheCreateManyInput | AnalysisCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisCache createManyAndReturn
   */
  export type AnalysisCacheCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnalysisCaches.
     */
    data: AnalysisCacheCreateManyInput | AnalysisCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisCache update
   */
  export type AnalysisCacheUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * The data needed to update a AnalysisCache.
     */
    data: XOR<AnalysisCacheUpdateInput, AnalysisCacheUncheckedUpdateInput>
    /**
     * Choose, which AnalysisCache to update.
     */
    where: AnalysisCacheWhereUniqueInput
  }

  /**
   * AnalysisCache updateMany
   */
  export type AnalysisCacheUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisCaches.
     */
    data: XOR<AnalysisCacheUpdateManyMutationInput, AnalysisCacheUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisCaches to update
     */
    where?: AnalysisCacheWhereInput
  }

  /**
   * AnalysisCache upsert
   */
  export type AnalysisCacheUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * The filter to search for the AnalysisCache to update in case it exists.
     */
    where: AnalysisCacheWhereUniqueInput
    /**
     * In case the AnalysisCache found by the `where` argument doesn't exist, create a new AnalysisCache with this data.
     */
    create: XOR<AnalysisCacheCreateInput, AnalysisCacheUncheckedCreateInput>
    /**
     * In case the AnalysisCache was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisCacheUpdateInput, AnalysisCacheUncheckedUpdateInput>
  }

  /**
   * AnalysisCache delete
   */
  export type AnalysisCacheDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
    /**
     * Filter which AnalysisCache to delete.
     */
    where: AnalysisCacheWhereUniqueInput
  }

  /**
   * AnalysisCache deleteMany
   */
  export type AnalysisCacheDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisCaches to delete
     */
    where?: AnalysisCacheWhereInput
  }

  /**
   * AnalysisCache without action
   */
  export type AnalysisCacheDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCache
     */
    select?: AnalysisCacheSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    telegramChatId: 'telegramChatId',
    telegramLinkCode: 'telegramLinkCode',
    telegramLinkCodeExpiresAt: 'telegramLinkCodeExpiresAt',
    telegramAlertsEnabled: 'telegramAlertsEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TradingAccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    mode: 'mode',
    balance: 'balance',
    equity: 'equity',
    riskPercent: 'riskPercent',
    maxDailyLoss: 'maxDailyLoss',
    maxDrawdown: 'maxDrawdown',
    maxTradesPerDay: 'maxTradesPerDay',
    currentDailyLoss: 'currentDailyLoss',
    currentDailyTrades: 'currentDailyTrades',
    lossesInARow: 'lossesInARow',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradingAccountScalarFieldEnum = (typeof TradingAccountScalarFieldEnum)[keyof typeof TradingAccountScalarFieldEnum]


  export const TradeScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    userId: 'userId',
    externalRef: 'externalRef',
    alertLogId: 'alertLogId',
    pair: 'pair',
    direction: 'direction',
    setupType: 'setupType',
    entryPrice: 'entryPrice',
    stopLoss: 'stopLoss',
    takeProfit: 'takeProfit',
    lotSize: 'lotSize',
    riskAmount: 'riskAmount',
    riskRewardRatio: 'riskRewardRatio',
    status: 'status',
    entryStatus: 'entryStatus',
    pnl: 'pnl',
    pipsPnl: 'pipsPnl',
    aiScore: 'aiScore',
    aiDecision: 'aiDecision',
    aiReasoning: 'aiReasoning',
    denialReason: 'denialReason',
    notes: 'notes',
    openedAt: 'openedAt',
    closedAt: 'closedAt',
    createdAt: 'createdAt'
  };

  export type TradeScalarFieldEnum = (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum]


  export const JournalEntryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tradeId: 'tradeId',
    date: 'date',
    type: 'type',
    content: 'content',
    mistakes: 'mistakes',
    disciplineScore: 'disciplineScore',
    aiFeedback: 'aiFeedback',
    tags: 'tags',
    createdAt: 'createdAt'
  };

  export type JournalEntryScalarFieldEnum = (typeof JournalEntryScalarFieldEnum)[keyof typeof JournalEntryScalarFieldEnum]


  export const DailyPlanScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    date: 'date',
    pairs: 'pairs',
    macroBias: 'macroBias',
    keyLevels: 'keyLevels',
    newsEvents: 'newsEvents',
    sessionFocus: 'sessionFocus',
    maxTrades: 'maxTrades',
    planNotes: 'planNotes',
    reviewNotes: 'reviewNotes',
    disciplineScore: 'disciplineScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DailyPlanScalarFieldEnum = (typeof DailyPlanScalarFieldEnum)[keyof typeof DailyPlanScalarFieldEnum]


  export const NewsEventScalarFieldEnum: {
    id: 'id',
    time: 'time',
    currency: 'currency',
    event: 'event',
    impact: 'impact',
    forecast: 'forecast',
    previous: 'previous',
    actual: 'actual',
    fetchedAt: 'fetchedAt'
  };

  export type NewsEventScalarFieldEnum = (typeof NewsEventScalarFieldEnum)[keyof typeof NewsEventScalarFieldEnum]


  export const AlertLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    pair: 'pair',
    alertType: 'alertType',
    score: 'score',
    session: 'session',
    direction: 'direction',
    channel: 'channel',
    sentAt: 'sentAt'
  };

  export type AlertLogScalarFieldEnum = (typeof AlertLogScalarFieldEnum)[keyof typeof AlertLogScalarFieldEnum]


  export const AnalysisCacheScalarFieldEnum: {
    id: 'id',
    pair: 'pair',
    analysis: 'analysis',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type AnalysisCacheScalarFieldEnum = (typeof AnalysisCacheScalarFieldEnum)[keyof typeof AnalysisCacheScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AccountMode'
   */
  export type EnumAccountModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountMode'>
    


  /**
   * Reference to a field of type 'AccountMode[]'
   */
  export type ListEnumAccountModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountMode[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TradeDirection'
   */
  export type EnumTradeDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeDirection'>
    


  /**
   * Reference to a field of type 'TradeDirection[]'
   */
  export type ListEnumTradeDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeDirection[]'>
    


  /**
   * Reference to a field of type 'SetupType'
   */
  export type EnumSetupTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SetupType'>
    


  /**
   * Reference to a field of type 'SetupType[]'
   */
  export type ListEnumSetupTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SetupType[]'>
    


  /**
   * Reference to a field of type 'TradeStatus'
   */
  export type EnumTradeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeStatus'>
    


  /**
   * Reference to a field of type 'TradeStatus[]'
   */
  export type ListEnumTradeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeStatus[]'>
    


  /**
   * Reference to a field of type 'EntryStatus'
   */
  export type EnumEntryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntryStatus'>
    


  /**
   * Reference to a field of type 'EntryStatus[]'
   */
  export type ListEnumEntryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntryStatus[]'>
    


  /**
   * Reference to a field of type 'JournalEntryType'
   */
  export type EnumJournalEntryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JournalEntryType'>
    


  /**
   * Reference to a field of type 'JournalEntryType[]'
   */
  export type ListEnumJournalEntryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JournalEntryType[]'>
    


  /**
   * Reference to a field of type 'NewsImpact'
   */
  export type EnumNewsImpactFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsImpact'>
    


  /**
   * Reference to a field of type 'NewsImpact[]'
   */
  export type ListEnumNewsImpactFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsImpact[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    telegramChatId?: StringNullableFilter<"User"> | string | null
    telegramLinkCode?: StringNullableFilter<"User"> | string | null
    telegramLinkCodeExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    telegramAlertsEnabled?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: TradingAccountListRelationFilter
    trades?: TradeListRelationFilter
    journal?: JournalEntryListRelationFilter
    dailyPlans?: DailyPlanListRelationFilter
    alertLogs?: AlertLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    telegramChatId?: SortOrderInput | SortOrder
    telegramLinkCode?: SortOrderInput | SortOrder
    telegramLinkCodeExpiresAt?: SortOrderInput | SortOrder
    telegramAlertsEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: TradingAccountOrderByRelationAggregateInput
    trades?: TradeOrderByRelationAggregateInput
    journal?: JournalEntryOrderByRelationAggregateInput
    dailyPlans?: DailyPlanOrderByRelationAggregateInput
    alertLogs?: AlertLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    telegramChatId?: string
    telegramLinkCode?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    telegramLinkCodeExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    telegramAlertsEnabled?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: TradingAccountListRelationFilter
    trades?: TradeListRelationFilter
    journal?: JournalEntryListRelationFilter
    dailyPlans?: DailyPlanListRelationFilter
    alertLogs?: AlertLogListRelationFilter
  }, "id" | "email" | "telegramChatId" | "telegramLinkCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    telegramChatId?: SortOrderInput | SortOrder
    telegramLinkCode?: SortOrderInput | SortOrder
    telegramLinkCodeExpiresAt?: SortOrderInput | SortOrder
    telegramAlertsEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    telegramChatId?: StringNullableWithAggregatesFilter<"User"> | string | null
    telegramLinkCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    telegramLinkCodeExpiresAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    telegramAlertsEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TradingAccountWhereInput = {
    AND?: TradingAccountWhereInput | TradingAccountWhereInput[]
    OR?: TradingAccountWhereInput[]
    NOT?: TradingAccountWhereInput | TradingAccountWhereInput[]
    id?: UuidFilter<"TradingAccount"> | string
    userId?: UuidFilter<"TradingAccount"> | string
    name?: StringFilter<"TradingAccount"> | string
    mode?: EnumAccountModeFilter<"TradingAccount"> | $Enums.AccountMode
    balance?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    equity?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFilter<"TradingAccount"> | number
    currentDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFilter<"TradingAccount"> | number
    lossesInARow?: IntFilter<"TradingAccount"> | number
    isActive?: BoolFilter<"TradingAccount"> | boolean
    createdAt?: DateTimeFilter<"TradingAccount"> | Date | string
    updatedAt?: DateTimeFilter<"TradingAccount"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trades?: TradeListRelationFilter
  }

  export type TradingAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    mode?: SortOrder
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    trades?: TradeOrderByRelationAggregateInput
  }

  export type TradingAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingAccountWhereInput | TradingAccountWhereInput[]
    OR?: TradingAccountWhereInput[]
    NOT?: TradingAccountWhereInput | TradingAccountWhereInput[]
    userId?: UuidFilter<"TradingAccount"> | string
    name?: StringFilter<"TradingAccount"> | string
    mode?: EnumAccountModeFilter<"TradingAccount"> | $Enums.AccountMode
    balance?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    equity?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFilter<"TradingAccount"> | number
    currentDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFilter<"TradingAccount"> | number
    lossesInARow?: IntFilter<"TradingAccount"> | number
    isActive?: BoolFilter<"TradingAccount"> | boolean
    createdAt?: DateTimeFilter<"TradingAccount"> | Date | string
    updatedAt?: DateTimeFilter<"TradingAccount"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trades?: TradeListRelationFilter
  }, "id">

  export type TradingAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    mode?: SortOrder
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingAccountCountOrderByAggregateInput
    _avg?: TradingAccountAvgOrderByAggregateInput
    _max?: TradingAccountMaxOrderByAggregateInput
    _min?: TradingAccountMinOrderByAggregateInput
    _sum?: TradingAccountSumOrderByAggregateInput
  }

  export type TradingAccountScalarWhereWithAggregatesInput = {
    AND?: TradingAccountScalarWhereWithAggregatesInput | TradingAccountScalarWhereWithAggregatesInput[]
    OR?: TradingAccountScalarWhereWithAggregatesInput[]
    NOT?: TradingAccountScalarWhereWithAggregatesInput | TradingAccountScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TradingAccount"> | string
    userId?: UuidWithAggregatesFilter<"TradingAccount"> | string
    name?: StringWithAggregatesFilter<"TradingAccount"> | string
    mode?: EnumAccountModeWithAggregatesFilter<"TradingAccount"> | $Enums.AccountMode
    balance?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    equity?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntWithAggregatesFilter<"TradingAccount"> | number
    currentDailyLoss?: DecimalWithAggregatesFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntWithAggregatesFilter<"TradingAccount"> | number
    lossesInARow?: IntWithAggregatesFilter<"TradingAccount"> | number
    isActive?: BoolWithAggregatesFilter<"TradingAccount"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TradingAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradingAccount"> | Date | string
  }

  export type TradeWhereInput = {
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    id?: UuidFilter<"Trade"> | string
    accountId?: UuidFilter<"Trade"> | string
    userId?: UuidFilter<"Trade"> | string
    externalRef?: StringNullableFilter<"Trade"> | string | null
    alertLogId?: UuidNullableFilter<"Trade"> | string | null
    pair?: StringFilter<"Trade"> | string
    direction?: EnumTradeDirectionFilter<"Trade"> | $Enums.TradeDirection
    setupType?: EnumSetupTypeFilter<"Trade"> | $Enums.SetupType
    entryPrice?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFilter<"Trade"> | $Enums.EntryStatus
    pnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFilter<"Trade"> | number
    aiDecision?: StringFilter<"Trade"> | string
    aiReasoning?: StringFilter<"Trade"> | string
    denialReason?: StringNullableFilter<"Trade"> | string | null
    notes?: StringNullableFilter<"Trade"> | string | null
    openedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    account?: XOR<TradingAccountRelationFilter, TradingAccountWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    alertLog?: XOR<AlertLogNullableRelationFilter, AlertLogWhereInput> | null
    journalEntries?: JournalEntryListRelationFilter
  }

  export type TradeOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    userId?: SortOrder
    externalRef?: SortOrderInput | SortOrder
    alertLogId?: SortOrderInput | SortOrder
    pair?: SortOrder
    direction?: SortOrder
    setupType?: SortOrder
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    status?: SortOrder
    entryStatus?: SortOrder
    pnl?: SortOrderInput | SortOrder
    pipsPnl?: SortOrderInput | SortOrder
    aiScore?: SortOrder
    aiDecision?: SortOrder
    aiReasoning?: SortOrder
    denialReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    openedAt?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    account?: TradingAccountOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    alertLog?: AlertLogOrderByWithRelationInput
    journalEntries?: JournalEntryOrderByRelationAggregateInput
  }

  export type TradeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    externalRef?: string
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    accountId?: UuidFilter<"Trade"> | string
    userId?: UuidFilter<"Trade"> | string
    alertLogId?: UuidNullableFilter<"Trade"> | string | null
    pair?: StringFilter<"Trade"> | string
    direction?: EnumTradeDirectionFilter<"Trade"> | $Enums.TradeDirection
    setupType?: EnumSetupTypeFilter<"Trade"> | $Enums.SetupType
    entryPrice?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFilter<"Trade"> | $Enums.EntryStatus
    pnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFilter<"Trade"> | number
    aiDecision?: StringFilter<"Trade"> | string
    aiReasoning?: StringFilter<"Trade"> | string
    denialReason?: StringNullableFilter<"Trade"> | string | null
    notes?: StringNullableFilter<"Trade"> | string | null
    openedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    account?: XOR<TradingAccountRelationFilter, TradingAccountWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    alertLog?: XOR<AlertLogNullableRelationFilter, AlertLogWhereInput> | null
    journalEntries?: JournalEntryListRelationFilter
  }, "id" | "externalRef">

  export type TradeOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    userId?: SortOrder
    externalRef?: SortOrderInput | SortOrder
    alertLogId?: SortOrderInput | SortOrder
    pair?: SortOrder
    direction?: SortOrder
    setupType?: SortOrder
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    status?: SortOrder
    entryStatus?: SortOrder
    pnl?: SortOrderInput | SortOrder
    pipsPnl?: SortOrderInput | SortOrder
    aiScore?: SortOrder
    aiDecision?: SortOrder
    aiReasoning?: SortOrder
    denialReason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    openedAt?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TradeCountOrderByAggregateInput
    _avg?: TradeAvgOrderByAggregateInput
    _max?: TradeMaxOrderByAggregateInput
    _min?: TradeMinOrderByAggregateInput
    _sum?: TradeSumOrderByAggregateInput
  }

  export type TradeScalarWhereWithAggregatesInput = {
    AND?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    OR?: TradeScalarWhereWithAggregatesInput[]
    NOT?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Trade"> | string
    accountId?: UuidWithAggregatesFilter<"Trade"> | string
    userId?: UuidWithAggregatesFilter<"Trade"> | string
    externalRef?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    alertLogId?: UuidNullableWithAggregatesFilter<"Trade"> | string | null
    pair?: StringWithAggregatesFilter<"Trade"> | string
    direction?: EnumTradeDirectionWithAggregatesFilter<"Trade"> | $Enums.TradeDirection
    setupType?: EnumSetupTypeWithAggregatesFilter<"Trade"> | $Enums.SetupType
    entryPrice?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusWithAggregatesFilter<"Trade"> | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusWithAggregatesFilter<"Trade"> | $Enums.EntryStatus
    pnl?: DecimalNullableWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: DecimalNullableWithAggregatesFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntWithAggregatesFilter<"Trade"> | number
    aiDecision?: StringWithAggregatesFilter<"Trade"> | string
    aiReasoning?: StringWithAggregatesFilter<"Trade"> | string
    denialReason?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Trade"> | string | null
    openedAt?: DateTimeNullableWithAggregatesFilter<"Trade"> | Date | string | null
    closedAt?: DateTimeNullableWithAggregatesFilter<"Trade"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Trade"> | Date | string
  }

  export type JournalEntryWhereInput = {
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    id?: UuidFilter<"JournalEntry"> | string
    userId?: UuidFilter<"JournalEntry"> | string
    tradeId?: UuidNullableFilter<"JournalEntry"> | string | null
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    type?: EnumJournalEntryTypeFilter<"JournalEntry"> | $Enums.JournalEntryType
    content?: StringFilter<"JournalEntry"> | string
    mistakes?: StringNullableListFilter<"JournalEntry">
    disciplineScore?: IntNullableFilter<"JournalEntry"> | number | null
    aiFeedback?: StringNullableFilter<"JournalEntry"> | string | null
    tags?: StringNullableListFilter<"JournalEntry">
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trade?: XOR<TradeNullableRelationFilter, TradeWhereInput> | null
  }

  export type JournalEntryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tradeId?: SortOrderInput | SortOrder
    date?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mistakes?: SortOrder
    disciplineScore?: SortOrderInput | SortOrder
    aiFeedback?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    trade?: TradeOrderByWithRelationInput
  }

  export type JournalEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JournalEntryWhereInput | JournalEntryWhereInput[]
    OR?: JournalEntryWhereInput[]
    NOT?: JournalEntryWhereInput | JournalEntryWhereInput[]
    userId?: UuidFilter<"JournalEntry"> | string
    tradeId?: UuidNullableFilter<"JournalEntry"> | string | null
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    type?: EnumJournalEntryTypeFilter<"JournalEntry"> | $Enums.JournalEntryType
    content?: StringFilter<"JournalEntry"> | string
    mistakes?: StringNullableListFilter<"JournalEntry">
    disciplineScore?: IntNullableFilter<"JournalEntry"> | number | null
    aiFeedback?: StringNullableFilter<"JournalEntry"> | string | null
    tags?: StringNullableListFilter<"JournalEntry">
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trade?: XOR<TradeNullableRelationFilter, TradeWhereInput> | null
  }, "id">

  export type JournalEntryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tradeId?: SortOrderInput | SortOrder
    date?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mistakes?: SortOrder
    disciplineScore?: SortOrderInput | SortOrder
    aiFeedback?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    _count?: JournalEntryCountOrderByAggregateInput
    _avg?: JournalEntryAvgOrderByAggregateInput
    _max?: JournalEntryMaxOrderByAggregateInput
    _min?: JournalEntryMinOrderByAggregateInput
    _sum?: JournalEntrySumOrderByAggregateInput
  }

  export type JournalEntryScalarWhereWithAggregatesInput = {
    AND?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    OR?: JournalEntryScalarWhereWithAggregatesInput[]
    NOT?: JournalEntryScalarWhereWithAggregatesInput | JournalEntryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"JournalEntry"> | string
    userId?: UuidWithAggregatesFilter<"JournalEntry"> | string
    tradeId?: UuidNullableWithAggregatesFilter<"JournalEntry"> | string | null
    date?: DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string
    type?: EnumJournalEntryTypeWithAggregatesFilter<"JournalEntry"> | $Enums.JournalEntryType
    content?: StringWithAggregatesFilter<"JournalEntry"> | string
    mistakes?: StringNullableListFilter<"JournalEntry">
    disciplineScore?: IntNullableWithAggregatesFilter<"JournalEntry"> | number | null
    aiFeedback?: StringNullableWithAggregatesFilter<"JournalEntry"> | string | null
    tags?: StringNullableListFilter<"JournalEntry">
    createdAt?: DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string
  }

  export type DailyPlanWhereInput = {
    AND?: DailyPlanWhereInput | DailyPlanWhereInput[]
    OR?: DailyPlanWhereInput[]
    NOT?: DailyPlanWhereInput | DailyPlanWhereInput[]
    id?: UuidFilter<"DailyPlan"> | string
    userId?: UuidFilter<"DailyPlan"> | string
    date?: DateTimeFilter<"DailyPlan"> | Date | string
    pairs?: StringNullableListFilter<"DailyPlan">
    macroBias?: StringFilter<"DailyPlan"> | string
    keyLevels?: StringFilter<"DailyPlan"> | string
    newsEvents?: StringFilter<"DailyPlan"> | string
    sessionFocus?: StringFilter<"DailyPlan"> | string
    maxTrades?: IntFilter<"DailyPlan"> | number
    planNotes?: StringNullableFilter<"DailyPlan"> | string | null
    reviewNotes?: StringNullableFilter<"DailyPlan"> | string | null
    disciplineScore?: IntNullableFilter<"DailyPlan"> | number | null
    createdAt?: DateTimeFilter<"DailyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"DailyPlan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type DailyPlanOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    pairs?: SortOrder
    macroBias?: SortOrder
    keyLevels?: SortOrder
    newsEvents?: SortOrder
    sessionFocus?: SortOrder
    maxTrades?: SortOrder
    planNotes?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    disciplineScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DailyPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_date?: DailyPlanUserIdDateCompoundUniqueInput
    AND?: DailyPlanWhereInput | DailyPlanWhereInput[]
    OR?: DailyPlanWhereInput[]
    NOT?: DailyPlanWhereInput | DailyPlanWhereInput[]
    userId?: UuidFilter<"DailyPlan"> | string
    date?: DateTimeFilter<"DailyPlan"> | Date | string
    pairs?: StringNullableListFilter<"DailyPlan">
    macroBias?: StringFilter<"DailyPlan"> | string
    keyLevels?: StringFilter<"DailyPlan"> | string
    newsEvents?: StringFilter<"DailyPlan"> | string
    sessionFocus?: StringFilter<"DailyPlan"> | string
    maxTrades?: IntFilter<"DailyPlan"> | number
    planNotes?: StringNullableFilter<"DailyPlan"> | string | null
    reviewNotes?: StringNullableFilter<"DailyPlan"> | string | null
    disciplineScore?: IntNullableFilter<"DailyPlan"> | number | null
    createdAt?: DateTimeFilter<"DailyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"DailyPlan"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_date">

  export type DailyPlanOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    pairs?: SortOrder
    macroBias?: SortOrder
    keyLevels?: SortOrder
    newsEvents?: SortOrder
    sessionFocus?: SortOrder
    maxTrades?: SortOrder
    planNotes?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    disciplineScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DailyPlanCountOrderByAggregateInput
    _avg?: DailyPlanAvgOrderByAggregateInput
    _max?: DailyPlanMaxOrderByAggregateInput
    _min?: DailyPlanMinOrderByAggregateInput
    _sum?: DailyPlanSumOrderByAggregateInput
  }

  export type DailyPlanScalarWhereWithAggregatesInput = {
    AND?: DailyPlanScalarWhereWithAggregatesInput | DailyPlanScalarWhereWithAggregatesInput[]
    OR?: DailyPlanScalarWhereWithAggregatesInput[]
    NOT?: DailyPlanScalarWhereWithAggregatesInput | DailyPlanScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DailyPlan"> | string
    userId?: UuidWithAggregatesFilter<"DailyPlan"> | string
    date?: DateTimeWithAggregatesFilter<"DailyPlan"> | Date | string
    pairs?: StringNullableListFilter<"DailyPlan">
    macroBias?: StringWithAggregatesFilter<"DailyPlan"> | string
    keyLevels?: StringWithAggregatesFilter<"DailyPlan"> | string
    newsEvents?: StringWithAggregatesFilter<"DailyPlan"> | string
    sessionFocus?: StringWithAggregatesFilter<"DailyPlan"> | string
    maxTrades?: IntWithAggregatesFilter<"DailyPlan"> | number
    planNotes?: StringNullableWithAggregatesFilter<"DailyPlan"> | string | null
    reviewNotes?: StringNullableWithAggregatesFilter<"DailyPlan"> | string | null
    disciplineScore?: IntNullableWithAggregatesFilter<"DailyPlan"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"DailyPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DailyPlan"> | Date | string
  }

  export type NewsEventWhereInput = {
    AND?: NewsEventWhereInput | NewsEventWhereInput[]
    OR?: NewsEventWhereInput[]
    NOT?: NewsEventWhereInput | NewsEventWhereInput[]
    id?: UuidFilter<"NewsEvent"> | string
    time?: DateTimeFilter<"NewsEvent"> | Date | string
    currency?: StringFilter<"NewsEvent"> | string
    event?: StringFilter<"NewsEvent"> | string
    impact?: EnumNewsImpactFilter<"NewsEvent"> | $Enums.NewsImpact
    forecast?: StringNullableFilter<"NewsEvent"> | string | null
    previous?: StringNullableFilter<"NewsEvent"> | string | null
    actual?: StringNullableFilter<"NewsEvent"> | string | null
    fetchedAt?: DateTimeFilter<"NewsEvent"> | Date | string
  }

  export type NewsEventOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    currency?: SortOrder
    event?: SortOrder
    impact?: SortOrder
    forecast?: SortOrderInput | SortOrder
    previous?: SortOrderInput | SortOrder
    actual?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
  }

  export type NewsEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsEventWhereInput | NewsEventWhereInput[]
    OR?: NewsEventWhereInput[]
    NOT?: NewsEventWhereInput | NewsEventWhereInput[]
    time?: DateTimeFilter<"NewsEvent"> | Date | string
    currency?: StringFilter<"NewsEvent"> | string
    event?: StringFilter<"NewsEvent"> | string
    impact?: EnumNewsImpactFilter<"NewsEvent"> | $Enums.NewsImpact
    forecast?: StringNullableFilter<"NewsEvent"> | string | null
    previous?: StringNullableFilter<"NewsEvent"> | string | null
    actual?: StringNullableFilter<"NewsEvent"> | string | null
    fetchedAt?: DateTimeFilter<"NewsEvent"> | Date | string
  }, "id">

  export type NewsEventOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    currency?: SortOrder
    event?: SortOrder
    impact?: SortOrder
    forecast?: SortOrderInput | SortOrder
    previous?: SortOrderInput | SortOrder
    actual?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
    _count?: NewsEventCountOrderByAggregateInput
    _max?: NewsEventMaxOrderByAggregateInput
    _min?: NewsEventMinOrderByAggregateInput
  }

  export type NewsEventScalarWhereWithAggregatesInput = {
    AND?: NewsEventScalarWhereWithAggregatesInput | NewsEventScalarWhereWithAggregatesInput[]
    OR?: NewsEventScalarWhereWithAggregatesInput[]
    NOT?: NewsEventScalarWhereWithAggregatesInput | NewsEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsEvent"> | string
    time?: DateTimeWithAggregatesFilter<"NewsEvent"> | Date | string
    currency?: StringWithAggregatesFilter<"NewsEvent"> | string
    event?: StringWithAggregatesFilter<"NewsEvent"> | string
    impact?: EnumNewsImpactWithAggregatesFilter<"NewsEvent"> | $Enums.NewsImpact
    forecast?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    previous?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    actual?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    fetchedAt?: DateTimeWithAggregatesFilter<"NewsEvent"> | Date | string
  }

  export type AlertLogWhereInput = {
    AND?: AlertLogWhereInput | AlertLogWhereInput[]
    OR?: AlertLogWhereInput[]
    NOT?: AlertLogWhereInput | AlertLogWhereInput[]
    id?: UuidFilter<"AlertLog"> | string
    userId?: UuidFilter<"AlertLog"> | string
    pair?: StringFilter<"AlertLog"> | string
    alertType?: StringFilter<"AlertLog"> | string
    score?: IntFilter<"AlertLog"> | number
    session?: StringFilter<"AlertLog"> | string
    direction?: StringNullableFilter<"AlertLog"> | string | null
    channel?: StringFilter<"AlertLog"> | string
    sentAt?: DateTimeFilter<"AlertLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trades?: TradeListRelationFilter
  }

  export type AlertLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    pair?: SortOrder
    alertType?: SortOrder
    score?: SortOrder
    session?: SortOrder
    direction?: SortOrderInput | SortOrder
    channel?: SortOrder
    sentAt?: SortOrder
    user?: UserOrderByWithRelationInput
    trades?: TradeOrderByRelationAggregateInput
  }

  export type AlertLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertLogWhereInput | AlertLogWhereInput[]
    OR?: AlertLogWhereInput[]
    NOT?: AlertLogWhereInput | AlertLogWhereInput[]
    userId?: UuidFilter<"AlertLog"> | string
    pair?: StringFilter<"AlertLog"> | string
    alertType?: StringFilter<"AlertLog"> | string
    score?: IntFilter<"AlertLog"> | number
    session?: StringFilter<"AlertLog"> | string
    direction?: StringNullableFilter<"AlertLog"> | string | null
    channel?: StringFilter<"AlertLog"> | string
    sentAt?: DateTimeFilter<"AlertLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    trades?: TradeListRelationFilter
  }, "id">

  export type AlertLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    pair?: SortOrder
    alertType?: SortOrder
    score?: SortOrder
    session?: SortOrder
    direction?: SortOrderInput | SortOrder
    channel?: SortOrder
    sentAt?: SortOrder
    _count?: AlertLogCountOrderByAggregateInput
    _avg?: AlertLogAvgOrderByAggregateInput
    _max?: AlertLogMaxOrderByAggregateInput
    _min?: AlertLogMinOrderByAggregateInput
    _sum?: AlertLogSumOrderByAggregateInput
  }

  export type AlertLogScalarWhereWithAggregatesInput = {
    AND?: AlertLogScalarWhereWithAggregatesInput | AlertLogScalarWhereWithAggregatesInput[]
    OR?: AlertLogScalarWhereWithAggregatesInput[]
    NOT?: AlertLogScalarWhereWithAggregatesInput | AlertLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AlertLog"> | string
    userId?: UuidWithAggregatesFilter<"AlertLog"> | string
    pair?: StringWithAggregatesFilter<"AlertLog"> | string
    alertType?: StringWithAggregatesFilter<"AlertLog"> | string
    score?: IntWithAggregatesFilter<"AlertLog"> | number
    session?: StringWithAggregatesFilter<"AlertLog"> | string
    direction?: StringNullableWithAggregatesFilter<"AlertLog"> | string | null
    channel?: StringWithAggregatesFilter<"AlertLog"> | string
    sentAt?: DateTimeWithAggregatesFilter<"AlertLog"> | Date | string
  }

  export type AnalysisCacheWhereInput = {
    AND?: AnalysisCacheWhereInput | AnalysisCacheWhereInput[]
    OR?: AnalysisCacheWhereInput[]
    NOT?: AnalysisCacheWhereInput | AnalysisCacheWhereInput[]
    id?: UuidFilter<"AnalysisCache"> | string
    pair?: StringFilter<"AnalysisCache"> | string
    analysis?: StringFilter<"AnalysisCache"> | string
    createdAt?: DateTimeFilter<"AnalysisCache"> | Date | string
    expiresAt?: DateTimeFilter<"AnalysisCache"> | Date | string
  }

  export type AnalysisCacheOrderByWithRelationInput = {
    id?: SortOrder
    pair?: SortOrder
    analysis?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AnalysisCacheWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalysisCacheWhereInput | AnalysisCacheWhereInput[]
    OR?: AnalysisCacheWhereInput[]
    NOT?: AnalysisCacheWhereInput | AnalysisCacheWhereInput[]
    pair?: StringFilter<"AnalysisCache"> | string
    analysis?: StringFilter<"AnalysisCache"> | string
    createdAt?: DateTimeFilter<"AnalysisCache"> | Date | string
    expiresAt?: DateTimeFilter<"AnalysisCache"> | Date | string
  }, "id">

  export type AnalysisCacheOrderByWithAggregationInput = {
    id?: SortOrder
    pair?: SortOrder
    analysis?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: AnalysisCacheCountOrderByAggregateInput
    _max?: AnalysisCacheMaxOrderByAggregateInput
    _min?: AnalysisCacheMinOrderByAggregateInput
  }

  export type AnalysisCacheScalarWhereWithAggregatesInput = {
    AND?: AnalysisCacheScalarWhereWithAggregatesInput | AnalysisCacheScalarWhereWithAggregatesInput[]
    OR?: AnalysisCacheScalarWhereWithAggregatesInput[]
    NOT?: AnalysisCacheScalarWhereWithAggregatesInput | AnalysisCacheScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AnalysisCache"> | string
    pair?: StringWithAggregatesFilter<"AnalysisCache"> | string
    analysis?: StringWithAggregatesFilter<"AnalysisCache"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisCache"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"AnalysisCache"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountCreateNestedManyWithoutUserInput
    trades?: TradeCreateNestedManyWithoutUserInput
    journal?: JournalEntryCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountUncheckedCreateNestedManyWithoutUserInput
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    journal?: JournalEntryUncheckedCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanUncheckedCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUpdateManyWithoutUserNestedInput
    trades?: TradeUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUncheckedUpdateManyWithoutUserNestedInput
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUncheckedUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUncheckedUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingAccountCreateInput = {
    id?: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
    trades?: TradeCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
    trades?: TradeUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountCreateManyInput = {
    id?: string
    userId: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeCreateInput = {
    id?: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutTradesInput
    user: UserCreateNestedOneWithoutTradesInput
    alertLog?: AlertLogCreateNestedOneWithoutTradesInput
    journalEntries?: JournalEntryCreateNestedManyWithoutTradeInput
  }

  export type TradeUncheckedCreateInput = {
    id?: string
    accountId: string
    userId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    journalEntries?: JournalEntryUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutTradesNestedInput
    user?: UserUpdateOneRequiredWithoutTradesNestedInput
    alertLog?: AlertLogUpdateOneWithoutTradesNestedInput
    journalEntries?: JournalEntryUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    journalEntries?: JournalEntryUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeCreateManyInput = {
    id?: string
    accountId: string
    userId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TradeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateInput = {
    id?: string
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutJournalInput
    trade?: TradeCreateNestedOneWithoutJournalEntriesInput
  }

  export type JournalEntryUncheckedCreateInput = {
    id?: string
    userId: string
    tradeId?: string | null
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type JournalEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJournalNestedInput
    trade?: TradeUpdateOneWithoutJournalEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateManyInput = {
    id?: string
    userId: string
    tradeId?: string | null
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type JournalEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanCreateInput = {
    id?: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDailyPlansInput
  }

  export type DailyPlanUncheckedCreateInput = {
    id?: string
    userId: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDailyPlansNestedInput
  }

  export type DailyPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanCreateManyInput = {
    id?: string
    userId: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventCreateInput = {
    id?: string
    time: Date | string
    currency: string
    event: string
    impact: $Enums.NewsImpact
    forecast?: string | null
    previous?: string | null
    actual?: string | null
    fetchedAt?: Date | string
  }

  export type NewsEventUncheckedCreateInput = {
    id?: string
    time: Date | string
    currency: string
    event: string
    impact: $Enums.NewsImpact
    forecast?: string | null
    previous?: string | null
    actual?: string | null
    fetchedAt?: Date | string
  }

  export type NewsEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    forecast?: NullableStringFieldUpdateOperationsInput | string | null
    previous?: NullableStringFieldUpdateOperationsInput | string | null
    actual?: NullableStringFieldUpdateOperationsInput | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    forecast?: NullableStringFieldUpdateOperationsInput | string | null
    previous?: NullableStringFieldUpdateOperationsInput | string | null
    actual?: NullableStringFieldUpdateOperationsInput | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventCreateManyInput = {
    id?: string
    time: Date | string
    currency: string
    event: string
    impact: $Enums.NewsImpact
    forecast?: string | null
    previous?: string | null
    actual?: string | null
    fetchedAt?: Date | string
  }

  export type NewsEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    forecast?: NullableStringFieldUpdateOperationsInput | string | null
    previous?: NullableStringFieldUpdateOperationsInput | string | null
    actual?: NullableStringFieldUpdateOperationsInput | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    forecast?: NullableStringFieldUpdateOperationsInput | string | null
    previous?: NullableStringFieldUpdateOperationsInput | string | null
    actual?: NullableStringFieldUpdateOperationsInput | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogCreateInput = {
    id?: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
    user: UserCreateNestedOneWithoutAlertLogsInput
    trades?: TradeCreateNestedManyWithoutAlertLogInput
  }

  export type AlertLogUncheckedCreateInput = {
    id?: string
    userId: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutAlertLogInput
  }

  export type AlertLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAlertLogsNestedInput
    trades?: TradeUpdateManyWithoutAlertLogNestedInput
  }

  export type AlertLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutAlertLogNestedInput
  }

  export type AlertLogCreateManyInput = {
    id?: string
    userId: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
  }

  export type AlertLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCacheCreateInput = {
    id?: string
    pair: string
    analysis: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AnalysisCacheUncheckedCreateInput = {
    id?: string
    pair: string
    analysis: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AnalysisCacheUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    analysis?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCacheUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    analysis?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCacheCreateManyInput = {
    id?: string
    pair: string
    analysis: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AnalysisCacheUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    analysis?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCacheUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    analysis?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TradingAccountListRelationFilter = {
    every?: TradingAccountWhereInput
    some?: TradingAccountWhereInput
    none?: TradingAccountWhereInput
  }

  export type TradeListRelationFilter = {
    every?: TradeWhereInput
    some?: TradeWhereInput
    none?: TradeWhereInput
  }

  export type JournalEntryListRelationFilter = {
    every?: JournalEntryWhereInput
    some?: JournalEntryWhereInput
    none?: JournalEntryWhereInput
  }

  export type DailyPlanListRelationFilter = {
    every?: DailyPlanWhereInput
    some?: DailyPlanWhereInput
    none?: DailyPlanWhereInput
  }

  export type AlertLogListRelationFilter = {
    every?: AlertLogWhereInput
    some?: AlertLogWhereInput
    none?: AlertLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TradingAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JournalEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailyPlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlertLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    telegramChatId?: SortOrder
    telegramLinkCode?: SortOrder
    telegramLinkCodeExpiresAt?: SortOrder
    telegramAlertsEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    telegramChatId?: SortOrder
    telegramLinkCode?: SortOrder
    telegramLinkCodeExpiresAt?: SortOrder
    telegramAlertsEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    telegramChatId?: SortOrder
    telegramLinkCode?: SortOrder
    telegramLinkCodeExpiresAt?: SortOrder
    telegramAlertsEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumAccountModeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountMode | EnumAccountModeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountModeFilter<$PrismaModel> | $Enums.AccountMode
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TradingAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    mode?: SortOrder
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingAccountAvgOrderByAggregateInput = {
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
  }

  export type TradingAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    mode?: SortOrder
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    mode?: SortOrder
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingAccountSumOrderByAggregateInput = {
    balance?: SortOrder
    equity?: SortOrder
    riskPercent?: SortOrder
    maxDailyLoss?: SortOrder
    maxDrawdown?: SortOrder
    maxTradesPerDay?: SortOrder
    currentDailyLoss?: SortOrder
    currentDailyTrades?: SortOrder
    lossesInARow?: SortOrder
  }

  export type EnumAccountModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountMode | EnumAccountModeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountModeWithAggregatesFilter<$PrismaModel> | $Enums.AccountMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountModeFilter<$PrismaModel>
    _max?: NestedEnumAccountModeFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type EnumTradeDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeDirection | EnumTradeDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeDirectionFilter<$PrismaModel> | $Enums.TradeDirection
  }

  export type EnumSetupTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupType | EnumSetupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSetupTypeFilter<$PrismaModel> | $Enums.SetupType
  }

  export type EnumTradeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusFilter<$PrismaModel> | $Enums.TradeStatus
  }

  export type EnumEntryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EntryStatus | EnumEntryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEntryStatusFilter<$PrismaModel> | $Enums.EntryStatus
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type TradingAccountRelationFilter = {
    is?: TradingAccountWhereInput
    isNot?: TradingAccountWhereInput
  }

  export type AlertLogNullableRelationFilter = {
    is?: AlertLogWhereInput | null
    isNot?: AlertLogWhereInput | null
  }

  export type TradeCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    userId?: SortOrder
    externalRef?: SortOrder
    alertLogId?: SortOrder
    pair?: SortOrder
    direction?: SortOrder
    setupType?: SortOrder
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    status?: SortOrder
    entryStatus?: SortOrder
    pnl?: SortOrder
    pipsPnl?: SortOrder
    aiScore?: SortOrder
    aiDecision?: SortOrder
    aiReasoning?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeAvgOrderByAggregateInput = {
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    pnl?: SortOrder
    pipsPnl?: SortOrder
    aiScore?: SortOrder
  }

  export type TradeMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    userId?: SortOrder
    externalRef?: SortOrder
    alertLogId?: SortOrder
    pair?: SortOrder
    direction?: SortOrder
    setupType?: SortOrder
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    status?: SortOrder
    entryStatus?: SortOrder
    pnl?: SortOrder
    pipsPnl?: SortOrder
    aiScore?: SortOrder
    aiDecision?: SortOrder
    aiReasoning?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    userId?: SortOrder
    externalRef?: SortOrder
    alertLogId?: SortOrder
    pair?: SortOrder
    direction?: SortOrder
    setupType?: SortOrder
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    status?: SortOrder
    entryStatus?: SortOrder
    pnl?: SortOrder
    pipsPnl?: SortOrder
    aiScore?: SortOrder
    aiDecision?: SortOrder
    aiReasoning?: SortOrder
    denialReason?: SortOrder
    notes?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeSumOrderByAggregateInput = {
    entryPrice?: SortOrder
    stopLoss?: SortOrder
    takeProfit?: SortOrder
    lotSize?: SortOrder
    riskAmount?: SortOrder
    riskRewardRatio?: SortOrder
    pnl?: SortOrder
    pipsPnl?: SortOrder
    aiScore?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTradeDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeDirection | EnumTradeDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeDirectionWithAggregatesFilter<$PrismaModel> | $Enums.TradeDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeDirectionFilter<$PrismaModel>
    _max?: NestedEnumTradeDirectionFilter<$PrismaModel>
  }

  export type EnumSetupTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupType | EnumSetupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSetupTypeWithAggregatesFilter<$PrismaModel> | $Enums.SetupType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSetupTypeFilter<$PrismaModel>
    _max?: NestedEnumSetupTypeFilter<$PrismaModel>
  }

  export type EnumTradeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeStatusFilter<$PrismaModel>
  }

  export type EnumEntryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntryStatus | EnumEntryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEntryStatusWithAggregatesFilter<$PrismaModel> | $Enums.EntryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntryStatusFilter<$PrismaModel>
    _max?: NestedEnumEntryStatusFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumJournalEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JournalEntryType | EnumJournalEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJournalEntryTypeFilter<$PrismaModel> | $Enums.JournalEntryType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TradeNullableRelationFilter = {
    is?: TradeWhereInput | null
    isNot?: TradeWhereInput | null
  }

  export type JournalEntryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tradeId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mistakes?: SortOrder
    disciplineScore?: SortOrder
    aiFeedback?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntryAvgOrderByAggregateInput = {
    disciplineScore?: SortOrder
  }

  export type JournalEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tradeId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    content?: SortOrder
    disciplineScore?: SortOrder
    aiFeedback?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tradeId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    content?: SortOrder
    disciplineScore?: SortOrder
    aiFeedback?: SortOrder
    createdAt?: SortOrder
  }

  export type JournalEntrySumOrderByAggregateInput = {
    disciplineScore?: SortOrder
  }

  export type EnumJournalEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JournalEntryType | EnumJournalEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJournalEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.JournalEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJournalEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumJournalEntryTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DailyPlanUserIdDateCompoundUniqueInput = {
    userId: string
    date: Date | string
  }

  export type DailyPlanCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    pairs?: SortOrder
    macroBias?: SortOrder
    keyLevels?: SortOrder
    newsEvents?: SortOrder
    sessionFocus?: SortOrder
    maxTrades?: SortOrder
    planNotes?: SortOrder
    reviewNotes?: SortOrder
    disciplineScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyPlanAvgOrderByAggregateInput = {
    maxTrades?: SortOrder
    disciplineScore?: SortOrder
  }

  export type DailyPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    macroBias?: SortOrder
    keyLevels?: SortOrder
    newsEvents?: SortOrder
    sessionFocus?: SortOrder
    maxTrades?: SortOrder
    planNotes?: SortOrder
    reviewNotes?: SortOrder
    disciplineScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyPlanMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    macroBias?: SortOrder
    keyLevels?: SortOrder
    newsEvents?: SortOrder
    sessionFocus?: SortOrder
    maxTrades?: SortOrder
    planNotes?: SortOrder
    reviewNotes?: SortOrder
    disciplineScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyPlanSumOrderByAggregateInput = {
    maxTrades?: SortOrder
    disciplineScore?: SortOrder
  }

  export type EnumNewsImpactFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsImpactFilter<$PrismaModel> | $Enums.NewsImpact
  }

  export type NewsEventCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    currency?: SortOrder
    event?: SortOrder
    impact?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    actual?: SortOrder
    fetchedAt?: SortOrder
  }

  export type NewsEventMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    currency?: SortOrder
    event?: SortOrder
    impact?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    actual?: SortOrder
    fetchedAt?: SortOrder
  }

  export type NewsEventMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    currency?: SortOrder
    event?: SortOrder
    impact?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    actual?: SortOrder
    fetchedAt?: SortOrder
  }

  export type EnumNewsImpactWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactFilter<$PrismaModel>
  }

  export type AlertLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pair?: SortOrder
    alertType?: SortOrder
    score?: SortOrder
    session?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AlertLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pair?: SortOrder
    alertType?: SortOrder
    score?: SortOrder
    session?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pair?: SortOrder
    alertType?: SortOrder
    score?: SortOrder
    session?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AnalysisCacheCountOrderByAggregateInput = {
    id?: SortOrder
    pair?: SortOrder
    analysis?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AnalysisCacheMaxOrderByAggregateInput = {
    id?: SortOrder
    pair?: SortOrder
    analysis?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AnalysisCacheMinOrderByAggregateInput = {
    id?: SortOrder
    pair?: SortOrder
    analysis?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type TradingAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput> | TradingAccountCreateWithoutUserInput[] | TradingAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradingAccountCreateOrConnectWithoutUserInput | TradingAccountCreateOrConnectWithoutUserInput[]
    createMany?: TradingAccountCreateManyUserInputEnvelope
    connect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
  }

  export type TradeCreateNestedManyWithoutUserInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type JournalEntryCreateNestedManyWithoutUserInput = {
    create?: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput> | JournalEntryCreateWithoutUserInput[] | JournalEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutUserInput | JournalEntryCreateOrConnectWithoutUserInput[]
    createMany?: JournalEntryCreateManyUserInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type DailyPlanCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput> | DailyPlanCreateWithoutUserInput[] | DailyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyPlanCreateOrConnectWithoutUserInput | DailyPlanCreateOrConnectWithoutUserInput[]
    createMany?: DailyPlanCreateManyUserInputEnvelope
    connect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
  }

  export type AlertLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput> | AlertLogCreateWithoutUserInput[] | AlertLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertLogCreateOrConnectWithoutUserInput | AlertLogCreateOrConnectWithoutUserInput[]
    createMany?: AlertLogCreateManyUserInputEnvelope
    connect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
  }

  export type TradingAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput> | TradingAccountCreateWithoutUserInput[] | TradingAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradingAccountCreateOrConnectWithoutUserInput | TradingAccountCreateOrConnectWithoutUserInput[]
    createMany?: TradingAccountCreateManyUserInputEnvelope
    connect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
  }

  export type TradeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput> | JournalEntryCreateWithoutUserInput[] | JournalEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutUserInput | JournalEntryCreateOrConnectWithoutUserInput[]
    createMany?: JournalEntryCreateManyUserInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type DailyPlanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput> | DailyPlanCreateWithoutUserInput[] | DailyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyPlanCreateOrConnectWithoutUserInput | DailyPlanCreateOrConnectWithoutUserInput[]
    createMany?: DailyPlanCreateManyUserInputEnvelope
    connect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
  }

  export type AlertLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput> | AlertLogCreateWithoutUserInput[] | AlertLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertLogCreateOrConnectWithoutUserInput | AlertLogCreateOrConnectWithoutUserInput[]
    createMany?: AlertLogCreateManyUserInputEnvelope
    connect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TradingAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput> | TradingAccountCreateWithoutUserInput[] | TradingAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradingAccountCreateOrConnectWithoutUserInput | TradingAccountCreateOrConnectWithoutUserInput[]
    upsert?: TradingAccountUpsertWithWhereUniqueWithoutUserInput | TradingAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradingAccountCreateManyUserInputEnvelope
    set?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    disconnect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    delete?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    connect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    update?: TradingAccountUpdateWithWhereUniqueWithoutUserInput | TradingAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradingAccountUpdateManyWithWhereWithoutUserInput | TradingAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradingAccountScalarWhereInput | TradingAccountScalarWhereInput[]
  }

  export type TradeUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutUserInput | TradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutUserInput | TradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutUserInput | TradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type JournalEntryUpdateManyWithoutUserNestedInput = {
    create?: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput> | JournalEntryCreateWithoutUserInput[] | JournalEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutUserInput | JournalEntryCreateOrConnectWithoutUserInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutUserInput | JournalEntryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JournalEntryCreateManyUserInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutUserInput | JournalEntryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutUserInput | JournalEntryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type DailyPlanUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput> | DailyPlanCreateWithoutUserInput[] | DailyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyPlanCreateOrConnectWithoutUserInput | DailyPlanCreateOrConnectWithoutUserInput[]
    upsert?: DailyPlanUpsertWithWhereUniqueWithoutUserInput | DailyPlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyPlanCreateManyUserInputEnvelope
    set?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    disconnect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    delete?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    connect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    update?: DailyPlanUpdateWithWhereUniqueWithoutUserInput | DailyPlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyPlanUpdateManyWithWhereWithoutUserInput | DailyPlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyPlanScalarWhereInput | DailyPlanScalarWhereInput[]
  }

  export type AlertLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput> | AlertLogCreateWithoutUserInput[] | AlertLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertLogCreateOrConnectWithoutUserInput | AlertLogCreateOrConnectWithoutUserInput[]
    upsert?: AlertLogUpsertWithWhereUniqueWithoutUserInput | AlertLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AlertLogCreateManyUserInputEnvelope
    set?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    disconnect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    delete?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    connect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    update?: AlertLogUpdateWithWhereUniqueWithoutUserInput | AlertLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AlertLogUpdateManyWithWhereWithoutUserInput | AlertLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AlertLogScalarWhereInput | AlertLogScalarWhereInput[]
  }

  export type TradingAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput> | TradingAccountCreateWithoutUserInput[] | TradingAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradingAccountCreateOrConnectWithoutUserInput | TradingAccountCreateOrConnectWithoutUserInput[]
    upsert?: TradingAccountUpsertWithWhereUniqueWithoutUserInput | TradingAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradingAccountCreateManyUserInputEnvelope
    set?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    disconnect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    delete?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    connect?: TradingAccountWhereUniqueInput | TradingAccountWhereUniqueInput[]
    update?: TradingAccountUpdateWithWhereUniqueWithoutUserInput | TradingAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradingAccountUpdateManyWithWhereWithoutUserInput | TradingAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradingAccountScalarWhereInput | TradingAccountScalarWhereInput[]
  }

  export type TradeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput> | TradeCreateWithoutUserInput[] | TradeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutUserInput | TradeCreateOrConnectWithoutUserInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutUserInput | TradeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TradeCreateManyUserInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutUserInput | TradeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutUserInput | TradeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput> | JournalEntryCreateWithoutUserInput[] | JournalEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutUserInput | JournalEntryCreateOrConnectWithoutUserInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutUserInput | JournalEntryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JournalEntryCreateManyUserInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutUserInput | JournalEntryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutUserInput | JournalEntryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type DailyPlanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput> | DailyPlanCreateWithoutUserInput[] | DailyPlanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyPlanCreateOrConnectWithoutUserInput | DailyPlanCreateOrConnectWithoutUserInput[]
    upsert?: DailyPlanUpsertWithWhereUniqueWithoutUserInput | DailyPlanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyPlanCreateManyUserInputEnvelope
    set?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    disconnect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    delete?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    connect?: DailyPlanWhereUniqueInput | DailyPlanWhereUniqueInput[]
    update?: DailyPlanUpdateWithWhereUniqueWithoutUserInput | DailyPlanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyPlanUpdateManyWithWhereWithoutUserInput | DailyPlanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyPlanScalarWhereInput | DailyPlanScalarWhereInput[]
  }

  export type AlertLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput> | AlertLogCreateWithoutUserInput[] | AlertLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertLogCreateOrConnectWithoutUserInput | AlertLogCreateOrConnectWithoutUserInput[]
    upsert?: AlertLogUpsertWithWhereUniqueWithoutUserInput | AlertLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AlertLogCreateManyUserInputEnvelope
    set?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    disconnect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    delete?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    connect?: AlertLogWhereUniqueInput | AlertLogWhereUniqueInput[]
    update?: AlertLogUpdateWithWhereUniqueWithoutUserInput | AlertLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AlertLogUpdateManyWithWhereWithoutUserInput | AlertLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AlertLogScalarWhereInput | AlertLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type TradeCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput> | TradeCreateWithoutAccountInput[] | TradeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAccountInput | TradeCreateOrConnectWithoutAccountInput[]
    createMany?: TradeCreateManyAccountInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type TradeUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput> | TradeCreateWithoutAccountInput[] | TradeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAccountInput | TradeCreateOrConnectWithoutAccountInput[]
    createMany?: TradeCreateManyAccountInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type EnumAccountModeFieldUpdateOperationsInput = {
    set?: $Enums.AccountMode
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type TradeUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput> | TradeCreateWithoutAccountInput[] | TradeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAccountInput | TradeCreateOrConnectWithoutAccountInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutAccountInput | TradeUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradeCreateManyAccountInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutAccountInput | TradeUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutAccountInput | TradeUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type TradeUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput> | TradeCreateWithoutAccountInput[] | TradeUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAccountInput | TradeCreateOrConnectWithoutAccountInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutAccountInput | TradeUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradeCreateManyAccountInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutAccountInput | TradeUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutAccountInput | TradeUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type TradingAccountCreateNestedOneWithoutTradesInput = {
    create?: XOR<TradingAccountCreateWithoutTradesInput, TradingAccountUncheckedCreateWithoutTradesInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutTradesInput
    connect?: TradingAccountWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTradesInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput
    connect?: UserWhereUniqueInput
  }

  export type AlertLogCreateNestedOneWithoutTradesInput = {
    create?: XOR<AlertLogCreateWithoutTradesInput, AlertLogUncheckedCreateWithoutTradesInput>
    connectOrCreate?: AlertLogCreateOrConnectWithoutTradesInput
    connect?: AlertLogWhereUniqueInput
  }

  export type JournalEntryCreateNestedManyWithoutTradeInput = {
    create?: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput> | JournalEntryCreateWithoutTradeInput[] | JournalEntryUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutTradeInput | JournalEntryCreateOrConnectWithoutTradeInput[]
    createMany?: JournalEntryCreateManyTradeInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type JournalEntryUncheckedCreateNestedManyWithoutTradeInput = {
    create?: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput> | JournalEntryCreateWithoutTradeInput[] | JournalEntryUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutTradeInput | JournalEntryCreateOrConnectWithoutTradeInput[]
    createMany?: JournalEntryCreateManyTradeInputEnvelope
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
  }

  export type EnumTradeDirectionFieldUpdateOperationsInput = {
    set?: $Enums.TradeDirection
  }

  export type EnumSetupTypeFieldUpdateOperationsInput = {
    set?: $Enums.SetupType
  }

  export type EnumTradeStatusFieldUpdateOperationsInput = {
    set?: $Enums.TradeStatus
  }

  export type EnumEntryStatusFieldUpdateOperationsInput = {
    set?: $Enums.EntryStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type TradingAccountUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<TradingAccountCreateWithoutTradesInput, TradingAccountUncheckedCreateWithoutTradesInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutTradesInput
    upsert?: TradingAccountUpsertWithoutTradesInput
    connect?: TradingAccountWhereUniqueInput
    update?: XOR<XOR<TradingAccountUpdateToOneWithWhereWithoutTradesInput, TradingAccountUpdateWithoutTradesInput>, TradingAccountUncheckedUpdateWithoutTradesInput>
  }

  export type UserUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradesInput
    upsert?: UserUpsertWithoutTradesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTradesInput, UserUpdateWithoutTradesInput>, UserUncheckedUpdateWithoutTradesInput>
  }

  export type AlertLogUpdateOneWithoutTradesNestedInput = {
    create?: XOR<AlertLogCreateWithoutTradesInput, AlertLogUncheckedCreateWithoutTradesInput>
    connectOrCreate?: AlertLogCreateOrConnectWithoutTradesInput
    upsert?: AlertLogUpsertWithoutTradesInput
    disconnect?: AlertLogWhereInput | boolean
    delete?: AlertLogWhereInput | boolean
    connect?: AlertLogWhereUniqueInput
    update?: XOR<XOR<AlertLogUpdateToOneWithWhereWithoutTradesInput, AlertLogUpdateWithoutTradesInput>, AlertLogUncheckedUpdateWithoutTradesInput>
  }

  export type JournalEntryUpdateManyWithoutTradeNestedInput = {
    create?: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput> | JournalEntryCreateWithoutTradeInput[] | JournalEntryUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutTradeInput | JournalEntryCreateOrConnectWithoutTradeInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutTradeInput | JournalEntryUpsertWithWhereUniqueWithoutTradeInput[]
    createMany?: JournalEntryCreateManyTradeInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutTradeInput | JournalEntryUpdateWithWhereUniqueWithoutTradeInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutTradeInput | JournalEntryUpdateManyWithWhereWithoutTradeInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type JournalEntryUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput> | JournalEntryCreateWithoutTradeInput[] | JournalEntryUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: JournalEntryCreateOrConnectWithoutTradeInput | JournalEntryCreateOrConnectWithoutTradeInput[]
    upsert?: JournalEntryUpsertWithWhereUniqueWithoutTradeInput | JournalEntryUpsertWithWhereUniqueWithoutTradeInput[]
    createMany?: JournalEntryCreateManyTradeInputEnvelope
    set?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    disconnect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    delete?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    connect?: JournalEntryWhereUniqueInput | JournalEntryWhereUniqueInput[]
    update?: JournalEntryUpdateWithWhereUniqueWithoutTradeInput | JournalEntryUpdateWithWhereUniqueWithoutTradeInput[]
    updateMany?: JournalEntryUpdateManyWithWhereWithoutTradeInput | JournalEntryUpdateManyWithWhereWithoutTradeInput[]
    deleteMany?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
  }

  export type JournalEntryCreatemistakesInput = {
    set: string[]
  }

  export type JournalEntryCreatetagsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutJournalInput = {
    create?: XOR<UserCreateWithoutJournalInput, UserUncheckedCreateWithoutJournalInput>
    connectOrCreate?: UserCreateOrConnectWithoutJournalInput
    connect?: UserWhereUniqueInput
  }

  export type TradeCreateNestedOneWithoutJournalEntriesInput = {
    create?: XOR<TradeCreateWithoutJournalEntriesInput, TradeUncheckedCreateWithoutJournalEntriesInput>
    connectOrCreate?: TradeCreateOrConnectWithoutJournalEntriesInput
    connect?: TradeWhereUniqueInput
  }

  export type EnumJournalEntryTypeFieldUpdateOperationsInput = {
    set?: $Enums.JournalEntryType
  }

  export type JournalEntryUpdatemistakesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type JournalEntryUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutJournalNestedInput = {
    create?: XOR<UserCreateWithoutJournalInput, UserUncheckedCreateWithoutJournalInput>
    connectOrCreate?: UserCreateOrConnectWithoutJournalInput
    upsert?: UserUpsertWithoutJournalInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJournalInput, UserUpdateWithoutJournalInput>, UserUncheckedUpdateWithoutJournalInput>
  }

  export type TradeUpdateOneWithoutJournalEntriesNestedInput = {
    create?: XOR<TradeCreateWithoutJournalEntriesInput, TradeUncheckedCreateWithoutJournalEntriesInput>
    connectOrCreate?: TradeCreateOrConnectWithoutJournalEntriesInput
    upsert?: TradeUpsertWithoutJournalEntriesInput
    disconnect?: TradeWhereInput | boolean
    delete?: TradeWhereInput | boolean
    connect?: TradeWhereUniqueInput
    update?: XOR<XOR<TradeUpdateToOneWithWhereWithoutJournalEntriesInput, TradeUpdateWithoutJournalEntriesInput>, TradeUncheckedUpdateWithoutJournalEntriesInput>
  }

  export type DailyPlanCreatepairsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutDailyPlansInput = {
    create?: XOR<UserCreateWithoutDailyPlansInput, UserUncheckedCreateWithoutDailyPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyPlansInput
    connect?: UserWhereUniqueInput
  }

  export type DailyPlanUpdatepairsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutDailyPlansNestedInput = {
    create?: XOR<UserCreateWithoutDailyPlansInput, UserUncheckedCreateWithoutDailyPlansInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyPlansInput
    upsert?: UserUpsertWithoutDailyPlansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDailyPlansInput, UserUpdateWithoutDailyPlansInput>, UserUncheckedUpdateWithoutDailyPlansInput>
  }

  export type EnumNewsImpactFieldUpdateOperationsInput = {
    set?: $Enums.NewsImpact
  }

  export type UserCreateNestedOneWithoutAlertLogsInput = {
    create?: XOR<UserCreateWithoutAlertLogsInput, UserUncheckedCreateWithoutAlertLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAlertLogsInput
    connect?: UserWhereUniqueInput
  }

  export type TradeCreateNestedManyWithoutAlertLogInput = {
    create?: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput> | TradeCreateWithoutAlertLogInput[] | TradeUncheckedCreateWithoutAlertLogInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAlertLogInput | TradeCreateOrConnectWithoutAlertLogInput[]
    createMany?: TradeCreateManyAlertLogInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type TradeUncheckedCreateNestedManyWithoutAlertLogInput = {
    create?: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput> | TradeCreateWithoutAlertLogInput[] | TradeUncheckedCreateWithoutAlertLogInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAlertLogInput | TradeCreateOrConnectWithoutAlertLogInput[]
    createMany?: TradeCreateManyAlertLogInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutAlertLogsNestedInput = {
    create?: XOR<UserCreateWithoutAlertLogsInput, UserUncheckedCreateWithoutAlertLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAlertLogsInput
    upsert?: UserUpsertWithoutAlertLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAlertLogsInput, UserUpdateWithoutAlertLogsInput>, UserUncheckedUpdateWithoutAlertLogsInput>
  }

  export type TradeUpdateManyWithoutAlertLogNestedInput = {
    create?: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput> | TradeCreateWithoutAlertLogInput[] | TradeUncheckedCreateWithoutAlertLogInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAlertLogInput | TradeCreateOrConnectWithoutAlertLogInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutAlertLogInput | TradeUpsertWithWhereUniqueWithoutAlertLogInput[]
    createMany?: TradeCreateManyAlertLogInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutAlertLogInput | TradeUpdateWithWhereUniqueWithoutAlertLogInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutAlertLogInput | TradeUpdateManyWithWhereWithoutAlertLogInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type TradeUncheckedUpdateManyWithoutAlertLogNestedInput = {
    create?: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput> | TradeCreateWithoutAlertLogInput[] | TradeUncheckedCreateWithoutAlertLogInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutAlertLogInput | TradeCreateOrConnectWithoutAlertLogInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutAlertLogInput | TradeUpsertWithWhereUniqueWithoutAlertLogInput[]
    createMany?: TradeCreateManyAlertLogInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutAlertLogInput | TradeUpdateWithWhereUniqueWithoutAlertLogInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutAlertLogInput | TradeUpdateManyWithWhereWithoutAlertLogInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumAccountModeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountMode | EnumAccountModeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountModeFilter<$PrismaModel> | $Enums.AccountMode
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumAccountModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountMode | EnumAccountModeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountMode[] | ListEnumAccountModeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountModeWithAggregatesFilter<$PrismaModel> | $Enums.AccountMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountModeFilter<$PrismaModel>
    _max?: NestedEnumAccountModeFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTradeDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeDirection | EnumTradeDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeDirectionFilter<$PrismaModel> | $Enums.TradeDirection
  }

  export type NestedEnumSetupTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupType | EnumSetupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSetupTypeFilter<$PrismaModel> | $Enums.SetupType
  }

  export type NestedEnumTradeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusFilter<$PrismaModel> | $Enums.TradeStatus
  }

  export type NestedEnumEntryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EntryStatus | EnumEntryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEntryStatusFilter<$PrismaModel> | $Enums.EntryStatus
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumTradeDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeDirection | EnumTradeDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeDirection[] | ListEnumTradeDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeDirectionWithAggregatesFilter<$PrismaModel> | $Enums.TradeDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeDirectionFilter<$PrismaModel>
    _max?: NestedEnumTradeDirectionFilter<$PrismaModel>
  }

  export type NestedEnumSetupTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupType | EnumSetupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SetupType[] | ListEnumSetupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSetupTypeWithAggregatesFilter<$PrismaModel> | $Enums.SetupType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSetupTypeFilter<$PrismaModel>
    _max?: NestedEnumSetupTypeFilter<$PrismaModel>
  }

  export type NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeStatus | EnumTradeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeStatus[] | ListEnumTradeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeStatusFilter<$PrismaModel>
  }

  export type NestedEnumEntryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntryStatus | EnumEntryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntryStatus[] | ListEnumEntryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEntryStatusWithAggregatesFilter<$PrismaModel> | $Enums.EntryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntryStatusFilter<$PrismaModel>
    _max?: NestedEnumEntryStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumJournalEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JournalEntryType | EnumJournalEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJournalEntryTypeFilter<$PrismaModel> | $Enums.JournalEntryType
  }

  export type NestedEnumJournalEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JournalEntryType | EnumJournalEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.JournalEntryType[] | ListEnumJournalEntryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumJournalEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.JournalEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJournalEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumJournalEntryTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNewsImpactFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsImpactFilter<$PrismaModel> | $Enums.NewsImpact
  }

  export type NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsImpact[] | ListEnumNewsImpactFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactFilter<$PrismaModel>
  }

  export type TradingAccountCreateWithoutUserInput = {
    id?: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountCreateOrConnectWithoutUserInput = {
    where: TradingAccountWhereUniqueInput
    create: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput>
  }

  export type TradingAccountCreateManyUserInputEnvelope = {
    data: TradingAccountCreateManyUserInput | TradingAccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TradeCreateWithoutUserInput = {
    id?: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutTradesInput
    alertLog?: AlertLogCreateNestedOneWithoutTradesInput
    journalEntries?: JournalEntryCreateNestedManyWithoutTradeInput
  }

  export type TradeUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    journalEntries?: JournalEntryUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeCreateOrConnectWithoutUserInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
  }

  export type TradeCreateManyUserInputEnvelope = {
    data: TradeCreateManyUserInput | TradeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type JournalEntryCreateWithoutUserInput = {
    id?: string
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
    trade?: TradeCreateNestedOneWithoutJournalEntriesInput
  }

  export type JournalEntryUncheckedCreateWithoutUserInput = {
    id?: string
    tradeId?: string | null
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type JournalEntryCreateOrConnectWithoutUserInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput>
  }

  export type JournalEntryCreateManyUserInputEnvelope = {
    data: JournalEntryCreateManyUserInput | JournalEntryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DailyPlanCreateWithoutUserInput = {
    id?: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyPlanUncheckedCreateWithoutUserInput = {
    id?: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyPlanCreateOrConnectWithoutUserInput = {
    where: DailyPlanWhereUniqueInput
    create: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput>
  }

  export type DailyPlanCreateManyUserInputEnvelope = {
    data: DailyPlanCreateManyUserInput | DailyPlanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AlertLogCreateWithoutUserInput = {
    id?: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
    trades?: TradeCreateNestedManyWithoutAlertLogInput
  }

  export type AlertLogUncheckedCreateWithoutUserInput = {
    id?: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutAlertLogInput
  }

  export type AlertLogCreateOrConnectWithoutUserInput = {
    where: AlertLogWhereUniqueInput
    create: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput>
  }

  export type AlertLogCreateManyUserInputEnvelope = {
    data: AlertLogCreateManyUserInput | AlertLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TradingAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: TradingAccountWhereUniqueInput
    update: XOR<TradingAccountUpdateWithoutUserInput, TradingAccountUncheckedUpdateWithoutUserInput>
    create: XOR<TradingAccountCreateWithoutUserInput, TradingAccountUncheckedCreateWithoutUserInput>
  }

  export type TradingAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: TradingAccountWhereUniqueInput
    data: XOR<TradingAccountUpdateWithoutUserInput, TradingAccountUncheckedUpdateWithoutUserInput>
  }

  export type TradingAccountUpdateManyWithWhereWithoutUserInput = {
    where: TradingAccountScalarWhereInput
    data: XOR<TradingAccountUpdateManyMutationInput, TradingAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type TradingAccountScalarWhereInput = {
    AND?: TradingAccountScalarWhereInput | TradingAccountScalarWhereInput[]
    OR?: TradingAccountScalarWhereInput[]
    NOT?: TradingAccountScalarWhereInput | TradingAccountScalarWhereInput[]
    id?: UuidFilter<"TradingAccount"> | string
    userId?: UuidFilter<"TradingAccount"> | string
    name?: StringFilter<"TradingAccount"> | string
    mode?: EnumAccountModeFilter<"TradingAccount"> | $Enums.AccountMode
    balance?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    equity?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFilter<"TradingAccount"> | number
    currentDailyLoss?: DecimalFilter<"TradingAccount"> | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFilter<"TradingAccount"> | number
    lossesInARow?: IntFilter<"TradingAccount"> | number
    isActive?: BoolFilter<"TradingAccount"> | boolean
    createdAt?: DateTimeFilter<"TradingAccount"> | Date | string
    updatedAt?: DateTimeFilter<"TradingAccount"> | Date | string
  }

  export type TradeUpsertWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput
    update: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>
    create: XOR<TradeCreateWithoutUserInput, TradeUncheckedCreateWithoutUserInput>
  }

  export type TradeUpdateWithWhereUniqueWithoutUserInput = {
    where: TradeWhereUniqueInput
    data: XOR<TradeUpdateWithoutUserInput, TradeUncheckedUpdateWithoutUserInput>
  }

  export type TradeUpdateManyWithWhereWithoutUserInput = {
    where: TradeScalarWhereInput
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutUserInput>
  }

  export type TradeScalarWhereInput = {
    AND?: TradeScalarWhereInput | TradeScalarWhereInput[]
    OR?: TradeScalarWhereInput[]
    NOT?: TradeScalarWhereInput | TradeScalarWhereInput[]
    id?: UuidFilter<"Trade"> | string
    accountId?: UuidFilter<"Trade"> | string
    userId?: UuidFilter<"Trade"> | string
    externalRef?: StringNullableFilter<"Trade"> | string | null
    alertLogId?: UuidNullableFilter<"Trade"> | string | null
    pair?: StringFilter<"Trade"> | string
    direction?: EnumTradeDirectionFilter<"Trade"> | $Enums.TradeDirection
    setupType?: EnumSetupTypeFilter<"Trade"> | $Enums.SetupType
    entryPrice?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFilter<"Trade"> | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFilter<"Trade"> | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFilter<"Trade"> | $Enums.EntryStatus
    pnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: DecimalNullableFilter<"Trade"> | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFilter<"Trade"> | number
    aiDecision?: StringFilter<"Trade"> | string
    aiReasoning?: StringFilter<"Trade"> | string
    denialReason?: StringNullableFilter<"Trade"> | string | null
    notes?: StringNullableFilter<"Trade"> | string | null
    openedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Trade"> | Date | string | null
    createdAt?: DateTimeFilter<"Trade"> | Date | string
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutUserInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutUserInput, JournalEntryUncheckedUpdateWithoutUserInput>
    create: XOR<JournalEntryCreateWithoutUserInput, JournalEntryUncheckedCreateWithoutUserInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutUserInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutUserInput, JournalEntryUncheckedUpdateWithoutUserInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutUserInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutUserInput>
  }

  export type JournalEntryScalarWhereInput = {
    AND?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    OR?: JournalEntryScalarWhereInput[]
    NOT?: JournalEntryScalarWhereInput | JournalEntryScalarWhereInput[]
    id?: UuidFilter<"JournalEntry"> | string
    userId?: UuidFilter<"JournalEntry"> | string
    tradeId?: UuidNullableFilter<"JournalEntry"> | string | null
    date?: DateTimeFilter<"JournalEntry"> | Date | string
    type?: EnumJournalEntryTypeFilter<"JournalEntry"> | $Enums.JournalEntryType
    content?: StringFilter<"JournalEntry"> | string
    mistakes?: StringNullableListFilter<"JournalEntry">
    disciplineScore?: IntNullableFilter<"JournalEntry"> | number | null
    aiFeedback?: StringNullableFilter<"JournalEntry"> | string | null
    tags?: StringNullableListFilter<"JournalEntry">
    createdAt?: DateTimeFilter<"JournalEntry"> | Date | string
  }

  export type DailyPlanUpsertWithWhereUniqueWithoutUserInput = {
    where: DailyPlanWhereUniqueInput
    update: XOR<DailyPlanUpdateWithoutUserInput, DailyPlanUncheckedUpdateWithoutUserInput>
    create: XOR<DailyPlanCreateWithoutUserInput, DailyPlanUncheckedCreateWithoutUserInput>
  }

  export type DailyPlanUpdateWithWhereUniqueWithoutUserInput = {
    where: DailyPlanWhereUniqueInput
    data: XOR<DailyPlanUpdateWithoutUserInput, DailyPlanUncheckedUpdateWithoutUserInput>
  }

  export type DailyPlanUpdateManyWithWhereWithoutUserInput = {
    where: DailyPlanScalarWhereInput
    data: XOR<DailyPlanUpdateManyMutationInput, DailyPlanUncheckedUpdateManyWithoutUserInput>
  }

  export type DailyPlanScalarWhereInput = {
    AND?: DailyPlanScalarWhereInput | DailyPlanScalarWhereInput[]
    OR?: DailyPlanScalarWhereInput[]
    NOT?: DailyPlanScalarWhereInput | DailyPlanScalarWhereInput[]
    id?: UuidFilter<"DailyPlan"> | string
    userId?: UuidFilter<"DailyPlan"> | string
    date?: DateTimeFilter<"DailyPlan"> | Date | string
    pairs?: StringNullableListFilter<"DailyPlan">
    macroBias?: StringFilter<"DailyPlan"> | string
    keyLevels?: StringFilter<"DailyPlan"> | string
    newsEvents?: StringFilter<"DailyPlan"> | string
    sessionFocus?: StringFilter<"DailyPlan"> | string
    maxTrades?: IntFilter<"DailyPlan"> | number
    planNotes?: StringNullableFilter<"DailyPlan"> | string | null
    reviewNotes?: StringNullableFilter<"DailyPlan"> | string | null
    disciplineScore?: IntNullableFilter<"DailyPlan"> | number | null
    createdAt?: DateTimeFilter<"DailyPlan"> | Date | string
    updatedAt?: DateTimeFilter<"DailyPlan"> | Date | string
  }

  export type AlertLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AlertLogWhereUniqueInput
    update: XOR<AlertLogUpdateWithoutUserInput, AlertLogUncheckedUpdateWithoutUserInput>
    create: XOR<AlertLogCreateWithoutUserInput, AlertLogUncheckedCreateWithoutUserInput>
  }

  export type AlertLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AlertLogWhereUniqueInput
    data: XOR<AlertLogUpdateWithoutUserInput, AlertLogUncheckedUpdateWithoutUserInput>
  }

  export type AlertLogUpdateManyWithWhereWithoutUserInput = {
    where: AlertLogScalarWhereInput
    data: XOR<AlertLogUpdateManyMutationInput, AlertLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AlertLogScalarWhereInput = {
    AND?: AlertLogScalarWhereInput | AlertLogScalarWhereInput[]
    OR?: AlertLogScalarWhereInput[]
    NOT?: AlertLogScalarWhereInput | AlertLogScalarWhereInput[]
    id?: UuidFilter<"AlertLog"> | string
    userId?: UuidFilter<"AlertLog"> | string
    pair?: StringFilter<"AlertLog"> | string
    alertType?: StringFilter<"AlertLog"> | string
    score?: IntFilter<"AlertLog"> | number
    session?: StringFilter<"AlertLog"> | string
    direction?: StringNullableFilter<"AlertLog"> | string | null
    channel?: StringFilter<"AlertLog"> | string
    sentAt?: DateTimeFilter<"AlertLog"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeCreateNestedManyWithoutUserInput
    journal?: JournalEntryCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    journal?: JournalEntryUncheckedCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanUncheckedCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type TradeCreateWithoutAccountInput = {
    id?: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutTradesInput
    alertLog?: AlertLogCreateNestedOneWithoutTradesInput
    journalEntries?: JournalEntryCreateNestedManyWithoutTradeInput
  }

  export type TradeUncheckedCreateWithoutAccountInput = {
    id?: string
    userId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    journalEntries?: JournalEntryUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeCreateOrConnectWithoutAccountInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput>
  }

  export type TradeCreateManyAccountInputEnvelope = {
    data: TradeCreateManyAccountInput | TradeCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUncheckedUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUncheckedUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TradeUpsertWithWhereUniqueWithoutAccountInput = {
    where: TradeWhereUniqueInput
    update: XOR<TradeUpdateWithoutAccountInput, TradeUncheckedUpdateWithoutAccountInput>
    create: XOR<TradeCreateWithoutAccountInput, TradeUncheckedCreateWithoutAccountInput>
  }

  export type TradeUpdateWithWhereUniqueWithoutAccountInput = {
    where: TradeWhereUniqueInput
    data: XOR<TradeUpdateWithoutAccountInput, TradeUncheckedUpdateWithoutAccountInput>
  }

  export type TradeUpdateManyWithWhereWithoutAccountInput = {
    where: TradeScalarWhereInput
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutAccountInput>
  }

  export type TradingAccountCreateWithoutTradesInput = {
    id?: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type TradingAccountUncheckedCreateWithoutTradesInput = {
    id?: string
    userId: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingAccountCreateOrConnectWithoutTradesInput = {
    where: TradingAccountWhereUniqueInput
    create: XOR<TradingAccountCreateWithoutTradesInput, TradingAccountUncheckedCreateWithoutTradesInput>
  }

  export type UserCreateWithoutTradesInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountCreateNestedManyWithoutUserInput
    journal?: JournalEntryCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTradesInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountUncheckedCreateNestedManyWithoutUserInput
    journal?: JournalEntryUncheckedCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanUncheckedCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTradesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
  }

  export type AlertLogCreateWithoutTradesInput = {
    id?: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
    user: UserCreateNestedOneWithoutAlertLogsInput
  }

  export type AlertLogUncheckedCreateWithoutTradesInput = {
    id?: string
    userId: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
  }

  export type AlertLogCreateOrConnectWithoutTradesInput = {
    where: AlertLogWhereUniqueInput
    create: XOR<AlertLogCreateWithoutTradesInput, AlertLogUncheckedCreateWithoutTradesInput>
  }

  export type JournalEntryCreateWithoutTradeInput = {
    id?: string
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutJournalInput
  }

  export type JournalEntryUncheckedCreateWithoutTradeInput = {
    id?: string
    userId: string
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type JournalEntryCreateOrConnectWithoutTradeInput = {
    where: JournalEntryWhereUniqueInput
    create: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput>
  }

  export type JournalEntryCreateManyTradeInputEnvelope = {
    data: JournalEntryCreateManyTradeInput | JournalEntryCreateManyTradeInput[]
    skipDuplicates?: boolean
  }

  export type TradingAccountUpsertWithoutTradesInput = {
    update: XOR<TradingAccountUpdateWithoutTradesInput, TradingAccountUncheckedUpdateWithoutTradesInput>
    create: XOR<TradingAccountCreateWithoutTradesInput, TradingAccountUncheckedCreateWithoutTradesInput>
    where?: TradingAccountWhereInput
  }

  export type TradingAccountUpdateToOneWithWhereWithoutTradesInput = {
    where?: TradingAccountWhereInput
    data: XOR<TradingAccountUpdateWithoutTradesInput, TradingAccountUncheckedUpdateWithoutTradesInput>
  }

  export type TradingAccountUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type TradingAccountUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutTradesInput = {
    update: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>
    create: XOR<UserCreateWithoutTradesInput, UserUncheckedCreateWithoutTradesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTradesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTradesInput, UserUncheckedUpdateWithoutTradesInput>
  }

  export type UserUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUncheckedUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUncheckedUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUncheckedUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AlertLogUpsertWithoutTradesInput = {
    update: XOR<AlertLogUpdateWithoutTradesInput, AlertLogUncheckedUpdateWithoutTradesInput>
    create: XOR<AlertLogCreateWithoutTradesInput, AlertLogUncheckedCreateWithoutTradesInput>
    where?: AlertLogWhereInput
  }

  export type AlertLogUpdateToOneWithWhereWithoutTradesInput = {
    where?: AlertLogWhereInput
    data: XOR<AlertLogUpdateWithoutTradesInput, AlertLogUncheckedUpdateWithoutTradesInput>
  }

  export type AlertLogUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAlertLogsNestedInput
  }

  export type AlertLogUncheckedUpdateWithoutTradesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUpsertWithWhereUniqueWithoutTradeInput = {
    where: JournalEntryWhereUniqueInput
    update: XOR<JournalEntryUpdateWithoutTradeInput, JournalEntryUncheckedUpdateWithoutTradeInput>
    create: XOR<JournalEntryCreateWithoutTradeInput, JournalEntryUncheckedCreateWithoutTradeInput>
  }

  export type JournalEntryUpdateWithWhereUniqueWithoutTradeInput = {
    where: JournalEntryWhereUniqueInput
    data: XOR<JournalEntryUpdateWithoutTradeInput, JournalEntryUncheckedUpdateWithoutTradeInput>
  }

  export type JournalEntryUpdateManyWithWhereWithoutTradeInput = {
    where: JournalEntryScalarWhereInput
    data: XOR<JournalEntryUpdateManyMutationInput, JournalEntryUncheckedUpdateManyWithoutTradeInput>
  }

  export type UserCreateWithoutJournalInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountCreateNestedManyWithoutUserInput
    trades?: TradeCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutJournalInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountUncheckedCreateNestedManyWithoutUserInput
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanUncheckedCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutJournalInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJournalInput, UserUncheckedCreateWithoutJournalInput>
  }

  export type TradeCreateWithoutJournalEntriesInput = {
    id?: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutTradesInput
    user: UserCreateNestedOneWithoutTradesInput
    alertLog?: AlertLogCreateNestedOneWithoutTradesInput
  }

  export type TradeUncheckedCreateWithoutJournalEntriesInput = {
    id?: string
    accountId: string
    userId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TradeCreateOrConnectWithoutJournalEntriesInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutJournalEntriesInput, TradeUncheckedCreateWithoutJournalEntriesInput>
  }

  export type UserUpsertWithoutJournalInput = {
    update: XOR<UserUpdateWithoutJournalInput, UserUncheckedUpdateWithoutJournalInput>
    create: XOR<UserCreateWithoutJournalInput, UserUncheckedCreateWithoutJournalInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJournalInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJournalInput, UserUncheckedUpdateWithoutJournalInput>
  }

  export type UserUpdateWithoutJournalInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUpdateManyWithoutUserNestedInput
    trades?: TradeUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutJournalInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUncheckedUpdateManyWithoutUserNestedInput
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUncheckedUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TradeUpsertWithoutJournalEntriesInput = {
    update: XOR<TradeUpdateWithoutJournalEntriesInput, TradeUncheckedUpdateWithoutJournalEntriesInput>
    create: XOR<TradeCreateWithoutJournalEntriesInput, TradeUncheckedCreateWithoutJournalEntriesInput>
    where?: TradeWhereInput
  }

  export type TradeUpdateToOneWithWhereWithoutJournalEntriesInput = {
    where?: TradeWhereInput
    data: XOR<TradeUpdateWithoutJournalEntriesInput, TradeUncheckedUpdateWithoutJournalEntriesInput>
  }

  export type TradeUpdateWithoutJournalEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutTradesNestedInput
    user?: UserUpdateOneRequiredWithoutTradesNestedInput
    alertLog?: AlertLogUpdateOneWithoutTradesNestedInput
  }

  export type TradeUncheckedUpdateWithoutJournalEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutDailyPlansInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountCreateNestedManyWithoutUserInput
    trades?: TradeCreateNestedManyWithoutUserInput
    journal?: JournalEntryCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDailyPlansInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountUncheckedCreateNestedManyWithoutUserInput
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    journal?: JournalEntryUncheckedCreateNestedManyWithoutUserInput
    alertLogs?: AlertLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDailyPlansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDailyPlansInput, UserUncheckedCreateWithoutDailyPlansInput>
  }

  export type UserUpsertWithoutDailyPlansInput = {
    update: XOR<UserUpdateWithoutDailyPlansInput, UserUncheckedUpdateWithoutDailyPlansInput>
    create: XOR<UserCreateWithoutDailyPlansInput, UserUncheckedCreateWithoutDailyPlansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDailyPlansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDailyPlansInput, UserUncheckedUpdateWithoutDailyPlansInput>
  }

  export type UserUpdateWithoutDailyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUpdateManyWithoutUserNestedInput
    trades?: TradeUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDailyPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUncheckedUpdateManyWithoutUserNestedInput
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUncheckedUpdateManyWithoutUserNestedInput
    alertLogs?: AlertLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAlertLogsInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountCreateNestedManyWithoutUserInput
    trades?: TradeCreateNestedManyWithoutUserInput
    journal?: JournalEntryCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAlertLogsInput = {
    id?: string
    email: string
    name?: string | null
    telegramChatId?: string | null
    telegramLinkCode?: string | null
    telegramLinkCodeExpiresAt?: Date | string | null
    telegramAlertsEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: TradingAccountUncheckedCreateNestedManyWithoutUserInput
    trades?: TradeUncheckedCreateNestedManyWithoutUserInput
    journal?: JournalEntryUncheckedCreateNestedManyWithoutUserInput
    dailyPlans?: DailyPlanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAlertLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAlertLogsInput, UserUncheckedCreateWithoutAlertLogsInput>
  }

  export type TradeCreateWithoutAlertLogInput = {
    id?: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutTradesInput
    user: UserCreateNestedOneWithoutTradesInput
    journalEntries?: JournalEntryCreateNestedManyWithoutTradeInput
  }

  export type TradeUncheckedCreateWithoutAlertLogInput = {
    id?: string
    accountId: string
    userId: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    journalEntries?: JournalEntryUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeCreateOrConnectWithoutAlertLogInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput>
  }

  export type TradeCreateManyAlertLogInputEnvelope = {
    data: TradeCreateManyAlertLogInput | TradeCreateManyAlertLogInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAlertLogsInput = {
    update: XOR<UserUpdateWithoutAlertLogsInput, UserUncheckedUpdateWithoutAlertLogsInput>
    create: XOR<UserCreateWithoutAlertLogsInput, UserUncheckedCreateWithoutAlertLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAlertLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAlertLogsInput, UserUncheckedUpdateWithoutAlertLogsInput>
  }

  export type UserUpdateWithoutAlertLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUpdateManyWithoutUserNestedInput
    trades?: TradeUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAlertLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCode?: NullableStringFieldUpdateOperationsInput | string | null
    telegramLinkCodeExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telegramAlertsEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: TradingAccountUncheckedUpdateManyWithoutUserNestedInput
    trades?: TradeUncheckedUpdateManyWithoutUserNestedInput
    journal?: JournalEntryUncheckedUpdateManyWithoutUserNestedInput
    dailyPlans?: DailyPlanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TradeUpsertWithWhereUniqueWithoutAlertLogInput = {
    where: TradeWhereUniqueInput
    update: XOR<TradeUpdateWithoutAlertLogInput, TradeUncheckedUpdateWithoutAlertLogInput>
    create: XOR<TradeCreateWithoutAlertLogInput, TradeUncheckedCreateWithoutAlertLogInput>
  }

  export type TradeUpdateWithWhereUniqueWithoutAlertLogInput = {
    where: TradeWhereUniqueInput
    data: XOR<TradeUpdateWithoutAlertLogInput, TradeUncheckedUpdateWithoutAlertLogInput>
  }

  export type TradeUpdateManyWithWhereWithoutAlertLogInput = {
    where: TradeScalarWhereInput
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutAlertLogInput>
  }

  export type TradingAccountCreateManyUserInput = {
    id?: string
    name: string
    mode: $Enums.AccountMode
    balance: Decimal | DecimalJsLike | number | string
    equity: Decimal | DecimalJsLike | number | string
    riskPercent: Decimal | DecimalJsLike | number | string
    maxDailyLoss: Decimal | DecimalJsLike | number | string
    maxDrawdown: Decimal | DecimalJsLike | number | string
    maxTradesPerDay: number
    currentDailyLoss?: Decimal | DecimalJsLike | number | string
    currentDailyTrades?: number
    lossesInARow?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeCreateManyUserInput = {
    id?: string
    accountId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type JournalEntryCreateManyUserInput = {
    id?: string
    tradeId?: string | null
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type DailyPlanCreateManyUserInput = {
    id?: string
    date: Date | string
    pairs?: DailyPlanCreatepairsInput | string[]
    macroBias: string
    keyLevels: string
    newsEvents: string
    sessionFocus: string
    maxTrades: number
    planNotes?: string | null
    reviewNotes?: string | null
    disciplineScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertLogCreateManyUserInput = {
    id?: string
    pair: string
    alertType: string
    score: number
    session: string
    direction?: string | null
    channel: string
    sentAt?: Date | string
  }

  export type TradingAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mode?: EnumAccountModeFieldUpdateOperationsInput | $Enums.AccountMode
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    equity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxDrawdown?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxTradesPerDay?: IntFieldUpdateOperationsInput | number
    currentDailyLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDailyTrades?: IntFieldUpdateOperationsInput | number
    lossesInARow?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutTradesNestedInput
    alertLog?: AlertLogUpdateOneWithoutTradesNestedInput
    journalEntries?: JournalEntryUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    journalEntries?: JournalEntryUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trade?: TradeUpdateOneWithoutJournalEntriesNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyPlanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pairs?: DailyPlanUpdatepairsInput | string[]
    macroBias?: StringFieldUpdateOperationsInput | string
    keyLevels?: StringFieldUpdateOperationsInput | string
    newsEvents?: StringFieldUpdateOperationsInput | string
    sessionFocus?: StringFieldUpdateOperationsInput | string
    maxTrades?: IntFieldUpdateOperationsInput | number
    planNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUpdateManyWithoutAlertLogNestedInput
  }

  export type AlertLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    trades?: TradeUncheckedUpdateManyWithoutAlertLogNestedInput
  }

  export type AlertLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pair?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    session?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeCreateManyAccountInput = {
    id?: string
    userId: string
    externalRef?: string | null
    alertLogId?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TradeUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTradesNestedInput
    alertLog?: AlertLogUpdateOneWithoutTradesNestedInput
    journalEntries?: JournalEntryUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    journalEntries?: JournalEntryUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    alertLogId?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryCreateManyTradeInput = {
    id?: string
    userId: string
    date: Date | string
    type: $Enums.JournalEntryType
    content: string
    mistakes?: JournalEntryCreatemistakesInput | string[]
    disciplineScore?: number | null
    aiFeedback?: string | null
    tags?: JournalEntryCreatetagsInput | string[]
    createdAt?: Date | string
  }

  export type JournalEntryUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJournalNestedInput
  }

  export type JournalEntryUncheckedUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JournalEntryUncheckedUpdateManyWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumJournalEntryTypeFieldUpdateOperationsInput | $Enums.JournalEntryType
    content?: StringFieldUpdateOperationsInput | string
    mistakes?: JournalEntryUpdatemistakesInput | string[]
    disciplineScore?: NullableIntFieldUpdateOperationsInput | number | null
    aiFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: JournalEntryUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeCreateManyAlertLogInput = {
    id?: string
    accountId: string
    userId: string
    externalRef?: string | null
    pair: string
    direction: $Enums.TradeDirection
    setupType: $Enums.SetupType
    entryPrice: Decimal | DecimalJsLike | number | string
    stopLoss: Decimal | DecimalJsLike | number | string
    takeProfit: Decimal | DecimalJsLike | number | string
    lotSize: Decimal | DecimalJsLike | number | string
    riskAmount: Decimal | DecimalJsLike | number | string
    riskRewardRatio: Decimal | DecimalJsLike | number | string
    status: $Enums.TradeStatus
    entryStatus: $Enums.EntryStatus
    pnl?: Decimal | DecimalJsLike | number | string | null
    pipsPnl?: Decimal | DecimalJsLike | number | string | null
    aiScore: number
    aiDecision: string
    aiReasoning: string
    denialReason?: string | null
    notes?: string | null
    openedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TradeUpdateWithoutAlertLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutTradesNestedInput
    user?: UserUpdateOneRequiredWithoutTradesNestedInput
    journalEntries?: JournalEntryUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateWithoutAlertLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    journalEntries?: JournalEntryUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeUncheckedUpdateManyWithoutAlertLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    externalRef?: NullableStringFieldUpdateOperationsInput | string | null
    pair?: StringFieldUpdateOperationsInput | string
    direction?: EnumTradeDirectionFieldUpdateOperationsInput | $Enums.TradeDirection
    setupType?: EnumSetupTypeFieldUpdateOperationsInput | $Enums.SetupType
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLoss?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    takeProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lotSize?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    riskRewardRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumTradeStatusFieldUpdateOperationsInput | $Enums.TradeStatus
    entryStatus?: EnumEntryStatusFieldUpdateOperationsInput | $Enums.EntryStatus
    pnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pipsPnl?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    aiScore?: IntFieldUpdateOperationsInput | number
    aiDecision?: StringFieldUpdateOperationsInput | string
    aiReasoning?: StringFieldUpdateOperationsInput | string
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradingAccountCountOutputTypeDefaultArgs instead
     */
    export type TradingAccountCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradingAccountCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradeCountOutputTypeDefaultArgs instead
     */
    export type TradeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlertLogCountOutputTypeDefaultArgs instead
     */
    export type AlertLogCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlertLogCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradingAccountDefaultArgs instead
     */
    export type TradingAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradingAccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradeDefaultArgs instead
     */
    export type TradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JournalEntryDefaultArgs instead
     */
    export type JournalEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JournalEntryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DailyPlanDefaultArgs instead
     */
    export type DailyPlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DailyPlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NewsEventDefaultArgs instead
     */
    export type NewsEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NewsEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlertLogDefaultArgs instead
     */
    export type AlertLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlertLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnalysisCacheDefaultArgs instead
     */
    export type AnalysisCacheArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnalysisCacheDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}