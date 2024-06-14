export class AuthError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class UserNotCreatedError extends AuthError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserNotCreatedError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}
