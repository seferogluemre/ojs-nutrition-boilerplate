import { useState } from 'react';
import { UsersDataTable } from '#/components/data-table/users-data-table';
import { UserFormModal } from './components/user-form-modal';
import { toast } from '#/hooks/use-toast';
import { mockUsers } from './data/data';
import { User } from 'better-auth/types';
import { ConfirmDialog } from '#components/confirm-dialog.js';

export const Users = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleView = (user: User) => {
        toast({
            title: "Detay Görüntüleme",
            description: `${user.firstName} ${user.lastName} kullanıcısının detayları görüntülenecek.`,
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormMode('edit');
        setIsFormModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setFormMode('create');
        setIsFormModalOpen(true);
    };

    const handleSaveUser = (userData: Partial<User>) => {
        if (formMode === 'create') {
            const newUser: User = {
                id: Date.now().toString(),
                firstName: userData.firstName!,
                lastName: userData.lastName!,
                email: userData.email!,
                role: userData.role!,
                image: userData.image,
                isActive: userData.isActive!,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setUsers([...users, newUser]);
            toast({
                title: "Başarılı",
                description: "Yeni kullanıcı başarıyla eklendi.",
            });
        } else if (selectedUser) {
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, ...userData }
                    : user
            ));
            toast({
                title: "Başarılı",
                description: "Kullanıcı bilgileri başarıyla güncellendi.",
            });
        }
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            setUsers(users.filter(user => user.id !== selectedUser.id));
            toast({
                title: "Başarılı",
                description: `${selectedUser.firstName} ${selectedUser.lastName} kullanıcısı başarıyla silindi.`,
            });
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kullanıcılar</h2>
                    <p className="text-muted-foreground">
                        Sistem kullanıcılarını yönetin ve düzenleyin.
                    </p>
                </div>
            </div>

            <UsersDataTable
                data={users}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
            />

            <UserFormModal
                open={isFormModalOpen}
                onOpenChange={setIsFormModalOpen}
                user={selectedUser}
                onSave={handleSaveUser}
                mode={formMode}
            />

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Kullanıcıyı Sil"
                description={`"${selectedUser?.firstName} ${selectedUser?.lastName}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default Users;