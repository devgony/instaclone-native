/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: roomUpdates
// ====================================================

export interface roomUpdates_roomUpdates_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface roomUpdates_roomUpdates {
  __typename: "Message";
  id: number;
  payload: string;
  user: roomUpdates_roomUpdates_user;
  read: boolean;
}

export interface roomUpdates {
  roomUpdates: roomUpdates_roomUpdates | null;
}

export interface roomUpdatesVariables {
  id: number;
}
