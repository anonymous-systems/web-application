import { UsernamePipe } from './username.pipe';

describe('UsernamePipe', () => {
  let pipe: UsernamePipe;

  beforeEach(() => {
    pipe = new UsernamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform to lowercase', () => {
    const input = 'This Is A Test';

    const expected = 'this-is-a-test';

    expect(pipe.transform(input)).toBe(expected);
  });

  it('should replace spaces with hyphens', () => {
    const input = 'username with spaces';

    const expected = 'username-with-spaces';

    expect(pipe.transform(input)).toBe(expected);
  });

  it('should remove non-alphanumeric characters (except hyphens)', () => {
    const input = 'user_name!@#$%^&*()_with_symbols+=-`~[]{}\\|;:\'",.<>/?';

    const expected = 'usernamewithsymbols-';

    expect(pipe.transform(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    const input = '';

    const expected = '';

    expect(pipe.transform(input)).toBe(expected);
  });

  it('should handle null input', () => {
    const input = null as any;

    const expected = '';

    expect(pipe.transform(input)).toBe(expected);
  });

  it('should handle numbers in the input', () => {
    const input = 'user123';

    const expected = 'user123';

    expect(pipe.transform(input)).toBe(expected);
  });
});
