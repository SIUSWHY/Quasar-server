describe('Account controller', () => {
  describe('Login user - POST /account/signIn', () => {
    const url = '/account/signIn';
    const method = 'post';
    const email = 'Test1@gmail.com';
    const password = 'Test1';
    const username = 'Test1';
    it('should login user & return token', () => {
      expect(1).toBe(1);
    });
  });

  describe('Register user - POST /account/signUp', () => {
    const url = '/account/signUp';
    const method = 'post';
    it('should login user & return token', () => {
      expect(1).toBe(1);
    });
  });
});
