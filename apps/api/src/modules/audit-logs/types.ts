import { Static } from 'elysia';
import { AuditLogAction, AuditLogEntity } from './constants';
import { findAuditLogsDto } from './dtos';

export type AuditLogActionType = typeof AuditLogAction[keyof typeof AuditLogAction];
export type AuditLogEntityType = typeof AuditLogEntity[keyof typeof AuditLogEntity];

export type AuditLogIndexResponse = Static<(typeof findAuditLogsDto)['response']['200']>;
export type AuditLogShowResponse = AuditLogIndexResponse['data'][number];
export type AuditLogIndexQuery = Static<(typeof findAuditLogsDto)['query']>;