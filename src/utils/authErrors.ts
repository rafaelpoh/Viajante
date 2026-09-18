/**
 * Traduz códigos de erro do Firebase Auth para mensagens claras em português.
 */
export function translateAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail informado é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta de usuário foi desativada.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Por favor, tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este endereço de e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/operation-not-allowed':
      return 'O método de autenticação por e-mail/senha não está ativado no Firebase.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.';
    default:
      return 'Não foi possível concluir a autenticação. Verifique sua conexão e tente novamente.';
  }
}
