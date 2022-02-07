export abstract class CtaEntity<T> {
  protected constructor(dto?: T) {
    if (dto) for (const key of Object.keys(dto)) this[key] = dto[key];
  }
}
