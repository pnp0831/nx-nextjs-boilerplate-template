export interface ErrorResponse {
  status: 400 | 300;
  errors: Array<ErrorDefinition>;
}

export interface ErrorDefinition {
  errorCode: string;
  message: string;
}
