import { Prisma } from "#prisma/client";
import { AuditLogActionType, AuditLogEntityType, AuditLogIndexQuery } from "./types";
import { PaginationService } from "../../utils";
import { AuditLogFormatter } from "./formatters";
import { prisma } from "#core";

export interface CreateAuditLogInput {
    userId: string;
    actionType: AuditLogActionType;
    entityType: AuditLogEntityType;
    entityUuid: string;
    description?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

export class AuditLogService {
    static async create(input: CreateAuditLogInput) {
        return prisma.auditLog.create({
            data: {
                userId: input.userId,
                actionType: input.actionType,
                entityType: input.entityType,
                entityUuid: input.entityUuid,
                description: input.description,
                metadata: input.metadata,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
            },
        });
    }

    static async find(input: AuditLogIndexQuery) {
        const {
            userId,
            name,
            actionType,
            entityType,
            entityUuid,
            startDate,
            endDate,
            orderBy = "desc",
        } = input;

        const where: Prisma.AuditLogWhereInput = {};

        if (userId) {
            where.userId = userId;
        }

        if (name) {
            where.user = {
                name: {
                    contains: name
                }
            };
        }

        if (actionType) {
            where.actionType = actionType;
        }

        if (entityType) {
            where.entityType = entityType;
        }

        if (entityUuid) {
            where.entityUuid = entityUuid;
        }

        if (startDate || endDate) {
            where.createdAt = {};

            if (startDate) {
                where.createdAt.gte = startDate;
            }

            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }

        const { skip, perPage } = PaginationService.getPaginationParams(input);

        const [items, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: orderBy,
                },
                skip,
                take: perPage,
            }),
            prisma.auditLog.count({ where }),
        ]);

        return PaginationService.createPaginatedResponse({
            data: items,
            total,
            query: input,
            formatter: AuditLogFormatter.formatWithUser,
        });
    }

    static async deleteOldLogs(olderThan: Date) {
        return prisma.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: olderThan,
                },
            },
        });
    }
}
