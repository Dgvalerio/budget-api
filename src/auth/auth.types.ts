import { authSchemas } from '@/auth/auth.schemas';
import { UserTypes } from '@/user/user.types';

import { createZodDto } from 'nestjs-zod';

export namespace AuthTypes {
  export interface GithubToken {
    access_token: string;
    token_type: string;
    scope: string;
  }

  export interface GithubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: null;
    bio: string;
    twitter_username: null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  }

  export interface Payload {
    email: UserTypes.Entity['email'];
    sub: UserTypes.Entity['id'];
  }

  export interface RequestData extends Request {
    user: { iat: number; exp: number } & Payload;
  }

  export interface Entity {
    user: UserTypes.Entity;
    token: string;
  }

  export class SignInDto extends createZodDto(authSchemas.signIn) {}
  export class GithubDto extends createZodDto(authSchemas.github) {}

  export interface Service {
    jwtToken(user: UserTypes.Entity): Promise<string>;
    signIn(data: SignInDto): Promise<Entity>;
    githubSignIn(data: GithubDto): Promise<Entity>;
  }

  export interface Controller {
    signIn(data: SignInDto): Promise<Entity>;
    githubSignIn(data: GithubDto): Promise<Entity>;
  }
}
