import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IRole } from '../../../core/interfaces/role/role.interface';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import { RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<IRole>();
  isLoading = true;

  constructor(
    private rolesService: RolesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.rolesService.findAll().subscribe(roles => {
      this.dataSource.data = roles;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openRoleModal(role?: IRole): void {
    const dialogRef = this.dialog.open(RoleModalComponent, {
      width: '400px',
      data: role ? { ...role } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deactivateRole(role: IRole): void {
    if (confirm(`Tem certeza que deseja desativar a função "${role.name}"?`)) {
      this.rolesService.deactivate(role.id).subscribe(() => {
        alert('Função desativada com sucesso.');
        this.loadRoles();
      });
    }
  }
}
