import { ConflictException, NotFoundException } from '@nestjs/common';

export const errorMessages = {
  account: {
    descriptionConflict: 'Essa descrição já foi utilizada!',
    accountNotFound: 'Essa conta não existe!',
  },
  auth: {
    userUnauthorized: 'Sua senha está incorreta!',
    githubUnauthorized: 'Seu código é inválido!',
  },
  bank: {
    nameConflict: 'Esse nome já foi usado!',
    bankNotFound: 'Esse banco não existe!',
  },
  operation: {
    operationNotFound: 'Essa operação não existe!',
  },
  user: {
    githubIdConflict: 'Esse githubId já foi usado!',
    emailConflict: 'Esse e-mail já foi usado!',
    userNotFound: 'Esse usuário não existe!',
  },
};

// Account
class AccountNotFound extends NotFoundException {
  constructor() {
    super(errorMessages.account.accountNotFound);
  }
}

class AccountDescriptionConflict extends ConflictException {
  constructor() {
    super(errorMessages.account.descriptionConflict);
  }
}

// Bank
class BankNotFound extends NotFoundException {
  constructor() {
    super(errorMessages.bank.bankNotFound);
  }
}

class BankNameConflict extends ConflictException {
  constructor() {
    super(errorMessages.bank.nameConflict);
  }
}

// Operation
class OperationNotFound extends NotFoundException {
  constructor() {
    super(errorMessages.operation.operationNotFound);
  }
}

// Exceptions
export const Exceptions = {
  Account: {
    DescriptionConflict: AccountDescriptionConflict,
    NotFound: AccountNotFound,
  },
  Bank: {
    NameConflict: BankNameConflict,
    NotFound: BankNotFound,
  },
  Operation: {
    NotFound: OperationNotFound,
  },
};
