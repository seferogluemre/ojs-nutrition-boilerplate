import { ConflictException, NotFoundException } from "#utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export abstract class HandleError {
  static  handlePrismaError(
    error: unknown,
    model: string,
    context: "find" | "create" | "update" | "delete"
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new NotFoundException(`${model} bulunamadı`);
      }
      if (
        error.code === "P2002" &&
        (context === "create" || context === "update")
      ) {
        const target = (error.meta?.target as string[])?.join(", ");
        return new ConflictException(`${target} zaten kullanılıyor.`);
      }
      if (error.code === "P2002" && context === "create") {
        return new ConflictException(`${model} zaten mevcut`);
      }
      if (error.code === "P2002" && context === "update") {
        return new ConflictException(`${model} zaten mevcut`);
      }
    }
    return error;
  }
}