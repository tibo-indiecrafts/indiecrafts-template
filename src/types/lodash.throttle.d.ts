declare module "lodash.throttle" {
  type ThrottleFn = <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean },
  ) => T & { cancel: () => void; flush: () => unknown };
  const throttle: ThrottleFn;
  export default throttle;
}
