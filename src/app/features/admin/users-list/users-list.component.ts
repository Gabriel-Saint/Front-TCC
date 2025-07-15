import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User, UsersService } from '../../../core/services/users.service';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { Router } from '@angular/router';

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

  displayedColumns: string[] = ['name', 'cpf', 'role', 'phone', 'actions'];
  dataSource = new MatTableDataSource<User>();
  isLoading = true;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditModal(user: User): void {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '600px',
      data: { ...user } // Passa uma cópia do usuário para o modal
    });

    dialogRef.afterClosed().subscribe((updatedUser: User) => {
      if (updatedUser) {
        // Atualiza a tabela com os dados retornados do modal
        const index = this.dataSource.data.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          const currentData = this.dataSource.data;
          currentData[index] = updatedUser;
          this.dataSource.data = currentData;
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja apagar o usuário ${user.name}?`)) {
      this.usersService.deleteUser(user.id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['admin/usuarios/novo']);
  }
}
