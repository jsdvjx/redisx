// Type definitions for redis 2.8
// Project: https://github.com/NodeRedis/node_redis
// Definitions by: Carlos Ballesteros Velasco <https://github.com/soywiz>
//                 Peter Harris <https://github.com/CodeAnimal>
//                 TANAKA Koichi <https://github.com/MugeSo>
//                 Stuart Schechter <https://github.com/UppaJung>
//                 Junyoung Choi <https://github.com/Rokt33r>
//                 James Garbutt <https://github.com/43081j>
//                 Bartek Szczepański <https://github.com/barnski>
//                 Pirasis Leelatanon <https://github.com/1pete>
//                 Stanislav Dzhus <https://github.com/blablapolicja>
//                 Jake Ferrante <https://github.com/ferrantejake>
//                 Adebayo Opesanya <https://github.com/OpesanyaAdebayo>
//                 Ryo Ota <https://github.com/nwtgck>
//                 Thomas de Barochez <https://github.com/tdebarochez>
//                 David Stephens <https://github.com/dwrss>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Imported from: https://github.com/types/npm-redis

/// <reference types="node" />

import { EventEmitter } from 'events';
import { Duplex } from 'stream';

export interface RetryStrategyOptions {
  error: NodeJS.ErrnoException;
  total_retry_time: number;
  times_connected: number;
  attempt: number;
}

export type RetryStrategy = (options: RetryStrategyOptions) => number | Error | unknown;
export type OK = 'OK'

/**
 * Client options.
 * @see https://github.com/NodeRedis/node-redis#user-content-options-object-properties
 */
export interface ClientOpts {
  /**
   * IP address of the Redis server.
   * @default 127.0.0.1
   */
  host?: string;
  /**
   * Port of the Redis server.
   * @default 6379
   */
  port?: number;
  /**
   * The UNIX socket string of the Redis server.
   * @default null
   */
  path?: string;
  /**
   * The URL of the Redis server.\
   * Format:
   * [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]\
   * More info avaliable at [IANA](http://www.iana.org/assignments/uri-schemes/prov/redis).
   * @default null
   */
  url?: string;
  parser?: string;
  /**
   * Set to `true`, Node Redis will return Redis number values as Strings instead of javascript Numbers.
   * Useful if you need to handle big numbers (above `Number.MAX_SAFE_INTEGER` === 2^53).
   * Hiredis is incapable of this behavior, so setting this option to `true`
   * will result in the built-in javascript parser being used no matter
   * the value of the `parser` option.
   * @default null
   */
  string_numbers?: boolean;
  /**
   * If set to `true`, then all replies will be sent to callbacks as Buffers instead of Strings.
   * @default false
   */
  return_buffers?: boolean;
  /**
   * If set to `true`, then replies will be sent to callbacks as Buffers.
   * This option lets you switch between Buffers and Strings on a per-command basis,
   * whereas `return_buffers` applies to every command on a client.\
   * **Note**: This doesn't work properly with the pubsub mode.
   * A subscriber has to either always return Strings or Buffers.
   * @default false
   */
  detect_buffers?: boolean;
  /**
   * If set to `true`, the keep-alive functionality is enabled on the underlying socket.
   * @default true
   */
  socket_keepalive?: boolean;
  /**
   * Initial Delay in milliseconds.
   * This will also set the initial delay for keep-alive packets being sent to Redis.
   * @default 0
   */
  socket_initial_delay?: number;
  /**
   * When a connection is established to the Redis server,
   * the server might still be loading the database from disk.
   * While loading, the server will not respond to any commands.
   * To work around this, Node Redis has a "ready check" which sends the **INFO** command to the server.
   * The response from the **INFO** command indicates whether the server is ready for more commands.
   * When ready, **node_redis** emits a **ready** event.
   * Setting `no_ready_check` to `true` will inhibit this check.
   * @default false
   */
  no_ready_check?: boolean;
  /**
   * By default, if there is no active connection to the Redis server,
   * commands are added to a queue and are executed once the connection has been established.
   * Setting `enable_offline_queue` to `false` will disable this feature
   * and the callback will be executed immediately with an error,
   * or an error will be emitted if no callback is specified.
   * @default true
   */
  enable_offline_queue?: boolean;
  retry_max_delay?: number;
  connect_timeout?: number;
  max_attempts?: number;
  /**
   * If set to `true`, all commands that were unfulfilled while the connection is lost
   * will be retried after the connection has been reestablished.
   * Use this with caution if you use state altering commands (e.g. incr).
   * This is especially useful if you use blocking commands.
   * @default false
   */
  retry_unfulfilled_commands?: boolean;
  auth_pass?: string;
  /**
   * If set, client will run Redis auth command on connect.
   * Alias `auth_pass`.\
   * **Note**: Node Redis < 2.5 must use `auth_pass`.
   * @default null
   */
  password?: string;
  /**
   * If set, client will run Redis **select** command on connect.
   * @default null
   */
  db?: string | number;
  /**
   * You can force using IPv6 if you set the family to **IPv6**.
   * @see Node.js [net](https://nodejs.org/api/net.html)
   * or [dns](https://nodejs.org/api/dns.html)
   * modules on how to use the family type.
   * @default IPv4
   */
  family?: string;
  /**
   * If set to `true`, a client won't resubscribe after disconnecting.
   * @default false
   */
  disable_resubscribing?: boolean;
  /**
   * Passing an object with renamed commands to use instead of the original functions.
   * For example, if you renamed the command **KEYS** to "DO-NOT-USE"
   * then the `rename_commands` object would be: { KEYS : "DO-NOT-USE" }.
   * @see the [Redis security topics](http://redis.io/topics/security) for more info.
   * @default null
   */
  rename_commands?: { [command: string]: string } | null;
  /**
   * An object containing options to pass to
   * [tls.connect](http://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback)
   * to set up a TLS connection to Redis
   * (if, for example, it is set up to be accessible via a tunnel).
   * @default null
   */
  tls?: any;
  /**
   * A string used to prefix all used keys (e.g. namespace:test).
   * Please be aware that the **keys** command will not be prefixed.
   * The **keys** command has a "pattern" as argument and no key
   * and it would be impossible to determine the existing keys in Redis if this would be prefixed.
   * @default null
   */
  prefix?: string;
  /**
   * A function that receives an options object as parameter including the retry `attempt`,
   * the `total_retry_time` indicating how much time passed since the last time connected,
   * the **error** why the connection was lost and the number of `times_connected` in total.
   * If you return a number from this function, the retry will happen after that time in milliseconds.
   * If you return a non-number, no further retry will happen
   * and all offline commands are flushed with errors.
   * Return an error to return that specific error to all offline commands.
   * @default function
   * @see interface `RetryStrategyOptions`
   * @example
   * const client = redis.createClient({
   *   retry_strategy: function(options) {
   *   if (options.error && options.error.code === "ECONNREFUSED") {
   *     // End reconnecting on a specific error and flush all commands with
   *     // a individual error
   *     return new Error("The server refused the connection");
   *   }
   *   if (options.total_retry_time > 1000 * 60 * 60) {
   *     // End reconnecting after a specific timeout and flush all commands
   *     // with a individual error
   *     return new Error("Retry time exhausted");
   *   }
   *   if (options.attempt > 10) {
   *     // End reconnecting with built in error
   *     return undefined;
   *   }
   *   // reconnect after
   *   return Math.min(options.attempt * 100, 3000);
   *   }
   * });
   */
  retry_strategy?: RetryStrategy;
}

export type Callback<T> = (err: Error | null, reply: T) => void;

export interface ServerInfo {
  redis_version: string;
  versions: number[];
}

export type OverloadedCommand<T, U, R> = (...args: [...T[], Callback<U> | undefined]) => R

export type OverloadedSetCommand<U> = {
  (key: string, ...args: [field_key: string, field_value: any][]): Promise<U>;
  (key: string, record: Record<string, any>): Promise<U>;
}


export type OverloadedListCommand = (...channel: string[]) => Promise<string>

export type OverloadedKeyCommand<T, U, R> =
  (key: string, ...args: [...T[], Callback<U> | undefined]) => R;

export type OverloadedLastCommand<T1, T2, U, R> = (...args: [...T1[], T2, Callback<U> | undefined]) => R

export interface Redisx {
  /**
   * Listen for all requests received by the server in real time.
   */
  monitor: () => Promise<unknown>;

  /**
   * Get information and statistics about the server.
   */
  info: (...section: string[]) => Promise<ServerInfo>;

  /**
   * Ping the server.
   */
  ping: (message?: string) => Promise<string>;

  /**
   * Post a message to a channel.
   */
  publish: (channel: string, value: string) => Promise<number>;

  /**
   * Authenticate to the server.
   */
  auth: (password: string) => Promise<string>;

  /**
   * KILL - Kill the connection of a client.
   * LIST - Get the list of client connections.
   * GETNAME - Get the current connection name.
   * PAUSE - Stop processing commands from clients for some time.
   * REPLY - Instruct the server whether to reply to commands.
   * SETNAME - Set the current connection name.
   */
  client: OverloadedCommand<string, any, R>;
  /**
   * Set multiple hash fields to multiple values.
   */
  hmset: OverloadedSetCommand<OK>;
  /**
   * Listen for messages published to the given channels.
   */
  subscribe: OverloadedListCommand
  /**
   * Stop listening for messages posted to the given channels.
   */
  unsubscribe: OverloadedListCommand
  /**
   * Listen for messages published to channels matching the given patterns.
   */
  psubscribe: OverloadedListCommand
  /**
   * Stop listening for messages posted to channels matching the given patterns.
   */
  punsubscribe: OverloadedListCommand

  /**
   * Append a value to a key.
   */
  append: (key: string, value: string) => Promise<number>;

  /**
   * Asynchronously rewrite the append-only file.
   */
  bgrewriteaof: () => Promise<OK>;

  /**
   * Asynchronously save the dataset to disk.
   */
  bgsave: () => Promise<string>;

  /**
   * Count set bits in a string.
   */
  bitcount: (key: string, start?: number, end?: number) => Promise<number>;


  /**
   * Perform arbitrary bitfield integer operations on strings.
   */
  bitfield: (key: string, command: string) => Promise<number>;

  /**
   * Perform bitwise operations between strings.
   */
  bitop: (operation: 'AND' | 'OR' | 'XOR' | 'NOT', destkey: string, ...keys: string[]) => Promise<number>;


  /**
   * Find first bit set or clear in a string.
   */
  bitpos: (key: string, bit: number, start?: number, end?: number) => Promise<number>;


  /**
   * Remove and get the first element in a list, or block until one is available.
   */
  blpop: OverloadedLastCommand<string, number, [string, string], R>;
  /**
   * Remove and get the last element in a list, or block until one is available.
   */
  brpop: OverloadedLastCommand<string, number, [string, string], R>;

  /**
   * Pop a value from a list, push it to another list and return it; or block until one is available.
   */
  brpoplpush(source: string, destination: string, timeout: number, cb?: Callback<string | null>): R;

  /**
   * ADDSLOTS - Assign new hash slots to receiving node.
   * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
   * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
   * DELSLOTS - Set hash slots as unbound in receiving node.
   * FAILOVER - Forces a slave to perform a manual failover of its master.
   * FORGET - Remove a node from the nodes table.
   * GETKEYSINSLOT - Return local key names in the specified hash slot.
   * INFO - Provides info about Redis Cluster node state.
   * KEYSLOT - Returns the hash slot of the specified key.
   * MEET - Force a node cluster to handshake with another node.
   * NODES - Get cluster config for the node.
   * REPLICATE - Reconfigure a node as a slave of the specified master node.
   * RESET - Reset a Redis Cluster node.
   * SAVECONFIG - Forces the node to save cluster state on disk.
   * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
   * SETSLOT - Bind a hash slot to a specified node.
   * SLAVES - List slave nodes of the specified master node.
   * SLOTS - Get array of Cluster slot to node mappings.
   */
  cluster: OverloadedCommand<string, any, this>;

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get total number of Redis commands.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific REdis command details.
   */
  command(cb?: Callback<Array<[string, number, string[], number, number, number]>>): R;

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get array of Redis command details.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific Redis command details.
   * GET - Get the value of a configuration parameter.
   * REWRITE - Rewrite the configuration file with the in memory configuration.
   * SET - Set a configuration parameter to the given value.
   * RESETSTAT - Reset the stats returned by INFO.
   */
  config: OverloadedCommand<string, boolean, R>;

  /**
   * Return the number of keys in the selected database.
   */
  dbsize(cb?: Callback<number>): R;

  /**
   * OBJECT - Get debugging information about a key.
   * SEGFAULT - Make the server crash.
   */
  debug: OverloadedCommand<string, boolean, R>;

  /**
   * Decrement the integer value of a key by one.
   */
  decr(key: string, cb?: Callback<number>): R;

  /**
   * Decrement the integer value of a key by the given number.
   */
  decrby(key: string, decrement: number, cb?: Callback<number>): R;

  /**
   * Delete a key.
   */
  del: OverloadedCommand<string, number, R>;

  /**
   * Discard all commands issued after MULTI.
   */
  discard(cb?: Callback<'OK'>): R;

  /**
   * Return a serialized version of the value stored at the specified key.
   */
  dump(key: string, cb?: Callback<string>): R;

  /**
   * Echo the given string.
   */
  echo<T extends string>(message: T, cb?: Callback<T>): R;

  /**
   * Execute a Lua script server side.
   */
  eval: OverloadedCommand<string | number, any, R>;
  /**
   * Execute a Lue script server side.
   */
  evalsha: OverloadedCommand<string | number, any, R>;
  /**
   * Determine if a key exists.
   */
  exists: OverloadedCommand<string, number, R>;

  /**
   * Set a key's time to live in seconds.
   */
  expire(key: string, seconds: number, cb?: Callback<number>): R;

  /**
   * Set the expiration for a key as a UNIX timestamp.
   */
  expireat(key: string, timestamp: number, cb?: Callback<number>): R;

  /**
   * Remove all keys from all databases.
   */
  flushall(cb?: Callback<string>): R;

  flushall(async: 'ASYNC', cb?: Callback<string>): R;

  /**
   * Remove all keys from the current database.
   */
  flushdb(cb?: Callback<'OK'>): R;

  flushdb(async: 'ASYNC', cb?: Callback<string>): R;

  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set.
   */
  geoadd: OverloadedKeyCommand<string | number, number, R>;
  /**
   * Returns members of a geospatial index as standard geohash strings.
   */
  geohash: OverloadedKeyCommand<string, string, R>;
  /**
   * Returns longitude and latitude of members of a geospatial index.
   */
  geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>;
  /**
   * Returns the distance between two members of a geospatial index.
   */
  geodist: OverloadedKeyCommand<string, string, R>;
  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
   */
  georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
   */
  georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

  /**
   * Get the value of a key.
   */
  get(key: string, cb?: Callback<string | null>): R;

  /**
   * Returns the bit value at offset in the string value stored at key.
   */
  getbit(key: string, offset: number, cb?: Callback<number>): R;

  /**
   * Get a substring of the string stored at a key.
   */
  getrange(key: string, start: number, end: number, cb?: Callback<string>): R;

  /**
   * Set the string value of a key and return its old value.
   */
  getset(key: string, value: string, cb?: Callback<string>): R;

  /**
   * Delete on or more hash fields.
   */
  hdel: OverloadedKeyCommand<string, number, R>;

  /**
   * Determine if a hash field exists.
   */
  hexists(key: string, field: string, cb?: Callback<number>): R;

  /**
   * Get the value of a hash field.
   */
  hget(key: string, field: string, cb?: Callback<string>): R;

  /**
   * Get all fields and values in a hash.
   */
  hgetall(key: string, cb?: Callback<{ [key: string]: string }>): R;

  /**
   * Increment the integer value of a hash field by the given number.
   */
  hincrby(key: string, field: string, increment: number, cb?: Callback<number>): R;

  /**
   * Increment the float value of a hash field by the given amount.
   */
  hincrbyfloat(key: string, field: string, increment: number, cb?: Callback<string>): R;

  /**
   * Get all the fields of a hash.
   */
  hkeys(key: string, cb?: Callback<string[]>): R;

  /**
   * Get the number of fields in a hash.
   */
  hlen(key: string, cb?: Callback<number>): R;

  /**
   * Get the values of all the given hash fields.
   */
  hmget: OverloadedKeyCommand<string, string[], R>;
  /**
   * Set the string value of a hash field.
   */
  hset: OverloadedSetCommand<string, number, R>;

  /**
   * Set the value of a hash field, only if the field does not exist.
   */
  hsetnx(key: string, field: string, value: string, cb?: Callback<number>): R;

  /**
   * Get the length of the value of a hash field.
   */
  hstrlen(key: string, field: string, cb?: Callback<number>): R;

  /**
   * Get all the values of a hash.
   */
  hvals(key: string, cb?: Callback<string[]>): R;

  /**
   * Increment the integer value of a key by one.
   */
  incr(key: string, cb?: Callback<number>): R;

  /**
   * Increment the integer value of a key by the given amount.
   */
  incrby(key: string, increment: number, cb?: Callback<number>): R;

  /**
   * Increment the float value of a key by the given amount.
   */
  incrbyfloat(key: string, increment: number, cb?: Callback<string>): R;

  /**
   * Find all keys matching the given pattern.
   */
  keys(pattern: string, cb?: Callback<string[]>): R;

  /**
   * Get the UNIX time stamp of the last successful save to disk.
   */
  lastsave(cb?: Callback<number>): R;

  /**
   * Get an element from a list by its index.
   */
  lindex(key: string, index: number, cb?: Callback<string>): R;

  /**
   * Insert an element before or after another element in a list.
   */
  linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string, cb?: Callback<string>): R;

  /**
   * Get the length of a list.
   */
  llen(key: string, cb?: Callback<number>): R;

  /**
   * Remove and get the first element in a list.
   */
  lpop(key: string, cb?: Callback<string>): R;

  /**
   * Prepend one or multiple values to a list.
   */
  lpush: OverloadedKeyCommand<string, number, R>;

  /**
   * Prepend a value to a list, only if the list exists.
   */
  lpushx(key: string, value: string, cb?: Callback<number>): R;

  /**
   * Get a range of elements from a list.
   */
  lrange(key: string, start: number, stop: number, cb?: Callback<string[]>): R;

  /**
   * Remove elements from a list.
   */
  lrem(key: string, count: number, value: string, cb?: Callback<number>): R;

  /**
   * Set the value of an element in a list by its index.
   */
  lset(key: string, index: number, value: string, cb?: Callback<'OK'>): R;

  /**
   * Trim a list to the specified range.
   */
  ltrim(key: string, start: number, stop: number, cb?: Callback<'OK'>): R;

  /**
   * Get the values of all given keys.
   */
  mget: OverloadedCommand<string, string[], R>;
  /**
   * Atomically tranfer a key from a Redis instance to another one.
   */
  migrate: OverloadedCommand<string, boolean, R>;

  /**
   * Move a key to another database.
   */
  move(key: string, db: string | number): R;

  /**
   * Set multiple keys to multiple values.
   */
  mset: OverloadedCommand<string, boolean, R>;
  /**
   * Set multiple keys to multiple values, only if none of the keys exist.
   */
  msetnx: OverloadedCommand<string, boolean, R>;
  /**
   * Inspect the internals of Redis objects.
   */
  object: OverloadedCommand<string, any, R>;

  /**
   * Remove the expiration from a key.
   */
  persist(key: string, cb?: Callback<number>): R;

  /**
   * Remove a key's time to live in milliseconds.
   */
  pexpire(key: string, milliseconds: number, cb?: Callback<number>): R;

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
   */
  pexpireat(key: string, millisecondsTimestamp: number, cb?: Callback<number>): R;

  /**
   * Adds the specified elements to the specified HyperLogLog.
   */
  pfadd: OverloadedKeyCommand<string, number, R>;
  /**
   * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
   */
  pfcount: OverloadedCommand<string, number, R>;
  /**
   * Merge N different HyperLogLogs into a single one.
   */
  pfmerge: OverloadedCommand<string, boolean, R>;

  /**
   * Set the value and expiration in milliseconds of a key.
   */
  psetex(key: string, milliseconds: number, value: string, cb?: Callback<'OK'>): R;

  /**
   * Inspect the state of the Pub/Sub subsytem.
   */
  pubsub: OverloadedCommand<string, number, R>;

  /**
   * Get the time to live for a key in milliseconds.
   */
  pttl(key: string, cb?: Callback<number>): R;

  /**
   * Close the connection.
   */
  quit(cb?: Callback<'OK'>): R;

  /**
   * Return a random key from the keyspace.
   */
  randomkey(cb?: Callback<string>): R;

  /**
   * Enables read queries for a connection to a cluster slave node.
   */
  readonly(cb?: Callback<string>): R;

  /**
   * Disables read queries for a connection to cluster slave node.
   */
  readwrite(cb?: Callback<string>): R;

  /**
   * Rename a key.
   */
  rename(key: string, newkey: string, cb?: Callback<'OK'>): R;

  /**
   * Rename a key, only if the new key does not exist.
   */
  renamenx(key: string, newkey: string, cb?: Callback<number>): R;

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP.
   */
  restore(key: string, ttl: number, serializedValue: string, cb?: Callback<'OK'>): R;

  /**
   * Return the role of the instance in the context of replication.
   */
  role(cb?: Callback<[string, number, Array<[string, string, string]>]>): R;

  /**
   * Remove and get the last element in a list.
   */
  rpop(key: string, cb?: Callback<string>): R;

  /**
   * Remove the last element in a list, prepend it to another list and return it.
   */
  rpoplpush(source: string, destination: string, cb?: Callback<string>): R;

  /**
   * Append one or multiple values to a list.
   */
  rpush: OverloadedKeyCommand<string, number, R>;

  /**
   * Append a value to a list, only if the list exists.
   */
  rpushx(key: string, value: string, cb?: Callback<number>): R;

  /**
   * Append one or multiple members to a set.
   */
  sadd: OverloadedKeyCommand<string, number, R>;

  /**
   * Synchronously save the dataset to disk.
   */
  save(cb?: Callback<string>): R;

  /**
   * Get the number of members in a set.
   */
  scard(key: string, cb?: Callback<number>): R;

  /**
   * DEBUG - Set the debug mode for executed scripts.
   * EXISTS - Check existence of scripts in the script cache.
   * FLUSH - Remove all scripts from the script cache.
   * KILL - Kill the script currently in execution.
   * LOAD - Load the specified Lua script into the script cache.
   */
  script: OverloadedCommand<string, any, R>;
  /**
   * Subtract multiple sets.
   */
  sdiff: OverloadedCommand<string, string[], R>;
  /**
   * Subtract multiple sets and store the resulting set in a key.
   */
  sdiffstore: OverloadedKeyCommand<string, number, R>;

  /**
   * Change the selected database for the current connection.
   */
  select(index: number | string, cb?: Callback<string>): R;

  /**
   * Set the string value of a key.
   */
  set(key: string, value: string, cb?: Callback<'OK'>): R;

  set(key: string, value: string, flag: string, cb?: Callback<'OK'>): R;

  set(key: string, value: string, mode: string, duration: number, cb?: Callback<'OK' | undefined>): R;

  set(key: string, value: string, mode: string, duration: number, flag: string, cb?: Callback<'OK' | undefined>): R;

  set(key: string, value: string, flag: string, mode: string, duration: number, cb?: Callback<'OK' | undefined>): R;

  /**
   * Sets or clears the bit at offset in the string value stored at key.
   */
  setbit(key: string, offset: number, value: string, cb?: Callback<number>): R;

  /**
   * Set the value and expiration of a key.
   */
  setex(key: string, seconds: number, value: string, cb?: Callback<string>): R;

  /**
   * Set the value of a key, only if the key does not exist.
   */
  setnx(key: string, value: string, cb?: Callback<number>): R;

  /**
   * Overwrite part of a string at key starting at the specified offset.
   */
  setrange(key: string, offset: number, value: string, cb?: Callback<number>): R;

  /**
   * Synchronously save the dataset to disk and then shut down the server.
   */
  shutdown: OverloadedCommand<string, string, R>;
  /**
   * Intersect multiple sets.
   */
  sinter: OverloadedKeyCommand<string, string[], R>;
  /**
   * Intersect multiple sets and store the resulting set in a key.
   */
  sinterstore: OverloadedCommand<string, number, R>;

  /**
   * Determine if a given value is a member of a set.
   */
  sismember(key: string, member: string, cb?: Callback<number>): R;

  /**
   * Make the server a slave of another instance, or promote it as master.
   */
  slaveof(host: string, port: string | number, cb?: Callback<string>): R;

  /**
   * Manages the Redis slow queries log.
   */
  slowlog: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>;

  /**
   * Get all the members in a set.
   */
  smembers(key: string, cb?: Callback<string[]>): R;

  /**
   * Move a member from one set to another.
   */
  smove(source: string, destination: string, member: string, cb?: Callback<number>): R;

  /**
   * Sort the elements in a list, set or sorted set.
   */
  sort: OverloadedCommand<string, string[], R>;

  /**
   * Remove and return one or multiple random members from a set.
   */
  spop(key: string, cb?: Callback<string>): R;

  spop(key: string, count: number, cb?: Callback<string[]>): R;

  /**
   * Get one or multiple random members from a set.
   */
  srandmember(key: string, cb?: Callback<string>): R;

  srandmember(key: string, count: number, cb?: Callback<string[]>): R;

  /**
   * Remove one or more members from a set.
   */
  srem: OverloadedKeyCommand<string, number, R>;

  /**
   * Get the length of the value stored in a key.
   */
  strlen(key: string, cb?: Callback<number>): R;

  /**
   * Add multiple sets.
   */
  sunion: OverloadedCommand<string, string[], R>;
  /**
   * Add multiple sets and store the resulting set in a key.
   */
  sunionstore: OverloadedCommand<string, number, R>;

  /**
   * Internal command used for replication.
   */
  sync(cb?: Callback<undefined>): R;

  /**
   * Return the current server time.
   */
  time(cb?: Callback<[string, string]>): R;

  /**
   * Get the time to live for a key.
   */
  ttl(key: string, cb?: Callback<number>): R;

  /**
   * Determine the type stored at key.
   */
  type(key: string, cb?: Callback<string>): R;

  /**
   * Deletes a key in a non-blocking manner.
   * Very similar to DEL, but actual memory reclamation
   * happens in a different thread, making this non-blocking.
   */
  unlink: OverloadedCommand<string, number, R>;

  /**
   * Forget about all watched keys.
   */
  unwatch(cb?: Callback<'OK'>): R;

  /**
   * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
   */
  wait(numslaves: number, timeout: number, cb?: Callback<number>): R;

  /**
   * Watch the given keys to determine execution of the MULTI/EXEC block.
   */
  watch: OverloadedCommand<string, 'OK', R>;
  /**
   * Add one or more members to a sorted set, or update its score if it already exists.
   */
  zadd: OverloadedKeyCommand<string | number, number, R>;

  /**
   * Get the number of members in a sorted set.
   */
  zcard(key: string, cb?: Callback<number>): R;

  /**
   * Count the members in a sorted set with scores between the given values.
   */
  zcount(key: string, min: number | string, max: number | string, cb?: Callback<number>): R;

  /**
   * Increment the score of a member in a sorted set.
   */
  zincrby(key: string, increment: number, member: string, cb?: Callback<string>): R;

  /**
   * Intersect multiple sorted sets and store the resulting sorted set in a new key.
   */
  zinterstore: OverloadedCommand<string | number, number, R>;

  /**
   * Count the number of members in a sorted set between a given lexicographic range.
   */
  zlexcount(key: string, min: string, max: string, cb?: Callback<number>): R;

  /**
   * Return a range of members in a sorted set, by index.
   */
  zrange(key: string, start: number, stop: number, cb?: Callback<string[]>): R;

  zrange(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R;

  /**
   * Return a range of members in a sorted set, by lexicographical range.
   */
  zrangebylex(key: string, min: string, max: string, cb?: Callback<string[]>): R;

  zrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  /**
   * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
   */
  zrevrangebylex(key: string, min: string, max: string, cb?: Callback<string[]>): R;

  zrevrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  /**
   * Return a range of members in a sorted set, by score.
   */
  zrangebyscore(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R;

  zrangebyscore(key: string, min: number | string, max: number | string, withscores: string, cb?: Callback<string[]>): R;

  zrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  zrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  /**
   * Determine the index of a member in a sorted set.
   */
  zrank(key: string, member: string, cb?: Callback<number | null>): R;

  /**
   * Remove one or more members from a sorted set.
   */
  zrem: OverloadedKeyCommand<string, number, R>;

  /**
   * Remove all members in a sorted set between the given lexicographical range.
   */
  zremrangebylex(key: string, min: string, max: string, cb?: Callback<number>): R;

  /**
   * Remove all members in a sorted set within the given indexes.
   */
  zremrangebyrank(key: string, start: number, stop: number, cb?: Callback<number>): R;

  /**
   * Remove all members in a sorted set within the given indexes.
   */
  zremrangebyscore(key: string, min: string | number, max: string | number, cb?: Callback<number>): R;

  /**
   * Return a range of members in a sorted set, by index, with scores ordered from high to low.
   */
  zrevrange(key: string, start: number, stop: number, cb?: Callback<string[]>): R;

  zrevrange(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R;

  /**
   * Return a range of members in a sorted set, by score, with scores ordered from high to low.
   */
  zrevrangebyscore(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R;

  zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string, cb?: Callback<string[]>): R;

  zrevrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number, cb?: Callback<string[]>): R;

  /**
   * Determine the index of a member in a sorted set, with scores ordered from high to low.
   */
  zrevrank(key: string, member: string, cb?: Callback<number | null>): R;

  /**
   * Get the score associated with the given member in a sorted set.
   */
  zscore(key: string, member: string, cb?: Callback<string>): R;

  /**
   * Add multiple sorted sets and store the resulting sorted set in a new key.
   */
  zunionstore: OverloadedCommand<string | number, number, R>;
  /**
   * Incrementally iterate the keys space.
   */
  scan: OverloadedCommand<string, [string, string[]], R>;
  /**
   * Incrementally iterate Set elements.
   */
  sscan: OverloadedKeyCommand<string, [string, string[]], R>;
  /**
   * Incrementally iterate hash fields and associated values.
   */
  hscan: OverloadedKeyCommand<string, [string, string[]], R>;
  /**
   * Incrementally iterate sorted sets elements and associated scores.
   */
  zscan: OverloadedKeyCommand<string, [string, string[]], R>;
}

const x = new Redisx({});
