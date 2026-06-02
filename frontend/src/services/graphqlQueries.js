/**
 * Queries y Mutations GraphQL
 * ISO/IEC 25022: Definición centralizada de operaciones GraphQL
 */

import { gql } from '@apollo/client';

/**
 * Mutation para login
 */
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      accessToken
      user {
        id
        email
        username
        fullName
        role
        isActive
      }
    }
  }
`;

/**
 * Mutation para registro
 */
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      user {
        id
        email
        username
        fullName
        isActive
      }
    }
  }
`;

/**
 * Mutation para solicitar reset de contraseña
 */
export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      success
      message
    }
  }
`;

/**
 * Mutation para reset de contraseña
 */
export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

/**
 * Mutation para cambio de contraseña
 */
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($userId: Int!, $input: ChangePasswordInput!) {
    changePassword(userId: $userId, input: $input) {
      success
      message
    }
  }
`;

/**
 * Query para verificar token
 */
export const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken($token: String!) {
    verifyToken(token: $token) {
      valid
      userId
      message
    }
  }
`;

/**
 * Query para obtener usuario
 */
export const GET_USER_QUERY = gql`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      email
      username
      fullName
      role
      isActive
      createdAt
    }
  }
`;

/**
 * Query para listar usuarios (admin)
 */
export const LIST_USERS_QUERY = gql`
  query ListUsers($skip: Int, $limit: Int) {
    listUsers(skip: $skip, limit: $limit) {
      total
      users {
        id
        email
        username
        fullName
        role
        isActive
        createdAt
      }
    }
  }
`;

/**
 * Mutation para desactivar usuario
 */
export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($userId: Int!) {
    deactivateUser(userId: $userId) {
      success
      message
    }
  }
`;
