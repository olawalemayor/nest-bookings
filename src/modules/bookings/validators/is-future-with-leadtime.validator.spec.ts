import { IsFutureWithLeadTime } from './is-future-with-leadtime.validator';
import { validate, Validate } from 'class-validator';

class T {
  @Validate(IsFutureWithLeadTime, [15])
  when: Date;
}

describe('IsFutureWithLeadTime', () => {
  it('rejects past dates', async () => {
    const t = new T();
    t.when = new Date(Date.now() + 5 * 60 * 1000); // only 5 minutes
    const errs = await validate(t);
    expect(errs.length).toBeGreaterThan(0);
  });

  it('accepts future beyond threshold', async () => {
    const t = new T();
    t.when = new Date(Date.now() + 20 * 60 * 1000);
    const errs = await validate(t);
    expect(errs.length).toBe(0);
  });
});
