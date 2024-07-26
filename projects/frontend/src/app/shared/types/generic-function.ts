/**
 * A type representing a generic function that returns a Promise.
 *
 * @type {Promise} GenericPromiseFunction
 * @template ArgumentType - The type of the arguments passed to the function.
 * @template ReturnType - The type of the value the promise resolves to.
 * @param {...ArgumentType} args - The arguments passed to the function.
 * @returns {Promise<ReturnType>} - A promise that resolves to a value of type ReturnType.
 */
export type GenericPromiseFunction<ArgumentType = unknown, ReturnType = unknown> = (...args: ArgumentType[]) => Promise<ReturnType>;

/**
 * A type representing a generic function.
 *
 * @type {function} GenericFunction
 * @template ArgumentType - The type of the arguments passed to the function.
 * @template ReturnType - The type of the value returned by the function.
 * @param {...ArgumentType} args - The arguments passed to the function.
 * @returns {ReturnType} - A value of type ReturnType.
 */
export type GenericFunction<ArgumentType = unknown, ReturnType = unknown> = (...args: ArgumentType[]) => ReturnType;
