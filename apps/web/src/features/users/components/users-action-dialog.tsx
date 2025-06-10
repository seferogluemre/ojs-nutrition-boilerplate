"use client";

import { PasswordInput } from "#components/password-input";
import { SelectDropdown } from "#components/select-dropdown";
import { Button } from "#components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "#components/ui/form";
import { Input } from "#components/ui/input";
import { ScrollArea } from "#components/ui/scroll-area";
import { toast } from "#hooks/use-toast";
import { useForm } from "react-hook-form";
import { userTypes } from "../data/data";
import { User } from "../data/schema";

interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  confirmPassword: string;
  isEdit: boolean;
}

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const form = useForm<UserFormData>({
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: "",
          confirmPassword: "",
          isEdit,
        }
      : {
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          role: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          isEdit,
        },
  });

  const onSubmit = (values: UserFormData) => {
    form.reset();
    toast({
      title: "Form başarıyla gönderildi:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    onOpenChange(false);
  };

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Kullanıcı bilgilerini güncelleyin"
              : "Yeni kullanıcı oluşturun"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{
                  required: "Ad gerekli"
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Ad</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                rules={{
                  required: "Soyad gerekli"
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Soyad</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                rules={{
                  required: "Kullanıcı adı gerekli"
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email gerekli",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Geçersiz email adresi"
                  }
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{
                  required: "Telefon numarası gerekli"
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Telefon</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                rules={{
                  required: "Rol seçimi gerekli"
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Rol</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        className="col-span-3"
                        options={userTypes}
                        placeholder="Rol seçin"
                        emptyText="Rol bulunamadı"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: !isEdit ? "Şifre gerekli" : false,
                  minLength: {
                    value: 8,
                    message: "Şifre en az 8 karakter olmalı"
                  },
                  validate: (value) => {
                    if (isEdit && !value) return true; // Edit modda boş şifre OK
                    if (!value.match(/[a-z]/)) return "En az bir küçük harf gerekli";
                    if (!value.match(/\d/)) return "En az bir rakam gerekli";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Şifre</FormLabel>
                    <FormControl>
                      <PasswordInput className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              {(!isEdit || isPasswordTouched) && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Şifre tekrarı gerekli",
                    validate: (value) => {
                      const password = form.getValues("password");
                      return value === password || "Şifreler eşleşmiyor";
                    }
                  }}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Şifre Tekrarı</FormLabel>
                      <FormControl>
                        <PasswordInput className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {isEdit ? "Güncelle" : "Oluştur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
