/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePhoto
// ====================================================

export interface seePhoto_seePhoto_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | null;
}

export interface seePhoto_seePhoto_comments_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface seePhoto_seePhoto_comments {
  __typename: "Comment";
  id: number;
  user: seePhoto_seePhoto_comments_user;
  payload: string;
  isMine: boolean;
  createdAt: string;
}

export interface seePhoto_seePhoto {
  __typename: "Photo";
  id: number;
  file: string;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
  user: seePhoto_seePhoto_user;
  caption: string | null;
  comments: (seePhoto_seePhoto_comments | null)[] | null;
  createdAt: string;
  isMine: boolean;
}

export interface seePhoto {
  seePhoto: seePhoto_seePhoto | null;
}

export interface seePhotoVariables {
  id: number;
}
