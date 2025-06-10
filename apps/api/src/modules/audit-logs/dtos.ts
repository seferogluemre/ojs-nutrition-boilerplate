import { t } from "elysia";
import { ControllerHook, paginationQueryDto, paginationResponseDto } from "../../utils";
import { AuditLogAction, AuditLogEntity } from "./constants";
import { AuditLogPlain } from "#prismabox/AuditLog";


const auditLogProperties = AuditLogPlain.properties;

export const AuditLogWithUser = t.Object({
    ...auditLogProperties,
    user: t.Object({
        id: t.String(),
        name: t.String(),
    }),
});

const auditLogsQueryDto = t.Object({
    userId: t.Optional(t.String()),
    name: t.Optional(t.String()),
    actionType: t.Optional(t.Enum(AuditLogAction)),
    entityType: t.Optional(t.Enum(AuditLogEntity)),
    entityUuid: t.Optional(t.String()),
    startDate: t.Optional(t.String({ format: "date-time" })),
    endDate: t.Optional(t.String({ format: "date-time" })),
    orderBy: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
});

export const findAuditLogsDto = {
    query: t.Composite([
        auditLogsQueryDto,
        paginationQueryDto,
    ]),
    response: {
        200: paginationResponseDto(AuditLogWithUser),
    },
    detail: {
        summary: "List Audit Logs",
    },
} satisfies ControllerHook;
