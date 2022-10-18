import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';

type User = {
  id: any;
  name: string;
  age: number;
  createdAt: string;
  updatedAt: string;
};

describe('Global Functions Unit Test', () => {
  let user: User;
  beforeEach(() => {
    user = {
      id: '123-456-789',
      name: 'Test',
      age: 22,
      createdAt: '2022-09-09',
      updatedAt: '2022-09-09'
    };
  });

  it('Should get define class', () => {
    expect(GlobalFunctions).toBeDefined();
  });

  it('Should get the same object without properties', () => {
    expect(
      GlobalFunctions.getNewParams<User>(user, ['id', 'createdAt', 'updatedAt'])
    ).toEqual({
      name: 'Test',
      age: 22
    });
  });

  it('Should get the same object without properties with validate id', () => {
    delete user.id;
    expect(
      GlobalFunctions.getNewParams<User>(
        user,
        ['createdAt', 'updatedAt'],
        ['id']
      )
    ).toEqual({
      id: 0,
      name: 'Test',
      age: 22
    });
  });

  it('Should get the correct value with safeVal', () => {
    expect(GlobalFunctions.safeVal(false, '123', '456')).toEqual('456');

    expect(GlobalFunctions.safeVal(true, '123', '456')).toEqual('123');
  });
});
