import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoginMode = true; // true para login, false para registro

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: this.isLoginMode ? 'Iniciando sesión...' : 'Registrando...',
      });
      await loading.present();

      try {
        const { email, password } = this.loginForm.value;
        let success = false;

        if (this.isLoginMode) {
          success = await this.authService.login(email, password);
        } else {
          success = await this.authService.register(email, password);
        }

        if (success) {
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: this.isLoginMode ? 'Bienvenido a Finanzas Personales' : 'Registro exitoso',
            buttons: ['OK'],
          });
          await alert.present();
          this.router.navigate(['/tabs']);
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: this.isLoginMode ? 'Credenciales incorrectas' : 'Error en el registro',
            buttons: ['OK'],
          });
          await alert.present();
        }
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error de conexión. Intente nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
      } finally {
        await loading.dismiss();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
