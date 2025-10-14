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

  // 👇 propiedades que faltaban
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';

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
        message: 'Iniciando sesión...',
      });
      await loading.present();

      try {
        const success = await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        );

        await loading.dismiss();

        if (success) {
          const alert = await this.alertController.create({
            header: 'Login Exitoso',
            message: 'Bienvenido a Finanzas Personales',
            buttons: ['OK'],
          });
          await alert.present();
          this.router.navigate(['/tabs']);
        } else {
          const alert = await this.alertController.create({
            header: 'Error de Login',
            message: 'Credenciales incorrectas. Intenta con admin@finanzas.com / 123456',
            buttons: ['OK'],
          });
          await alert.present();
        }
      } catch (error) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error durante el login.',
          buttons: ['OK'],
        });
        await alert.present();
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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off-outline';
    }
  }
}
