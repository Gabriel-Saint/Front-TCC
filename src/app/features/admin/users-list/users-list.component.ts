import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


import { UsersService } from '../../../core/services/users.service';
import { IUser } from '../../../core/interfaces/user/user.interface'; // Usando a nova interface
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  // As colunas correspondem às propriedades da interface IUser
  displayedColumns: string[] = ['name', 'cpf', 'role', 'phone', 'actions'];
  // 2. Use a interface IUser para o MatTableDataSource
  dataSource = new MatTableDataSource<IUser>();
  isLoading = true;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 3. O método getUsers() agora busca os dados da sua API real
    this.usersService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditModal(user: IUser): void {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '600px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe((updatedUser: IUser) => {
      if (updatedUser) {
        const index = this.dataSource.data.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          const currentData = this.dataSource.data;
          currentData[index] = updatedUser;
          this.dataSource.data = currentData;
        }
      }
    });
  }

  deleteUser(user: IUser): void {
    // Lembre-se que você precisa implementar a rota DELETE no seu backend
    if (confirm(`Tem certeza que deseja apagar o usuário ${user.name}?`)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
          alert('Usuário deletado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao deletar usuário:', err);
          alert('Falha ao deletar usuário. Verifique se a rota existe no backend.');
        }
      });
    }
  }

  goToRegister(): void {
    // A rota para criar um usuário. Pode ser ajustada se necessário.
    this.router.navigate(['admin/usuarios/novo']);
  }
}
