export enum Role {
  VISITOR = 'visitor',
  STANDARD = 'standard',
  ADMIN = 'root'
}

export const BASIC = [Role.ADMIN, Role.STANDARD];

export const ALL_ROLES = Object.values(Role);

export const ADMINISTRATORS = [Role.ADMIN];
