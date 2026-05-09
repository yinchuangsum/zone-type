import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const registerDto: RegisterDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
  };

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const registerResult = { accessToken: 'jwt-token' };
  const loginResult = { accessToken: 'jwt-token' };
  const profileResult = {
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(registerResult),
            login: jest.fn().mockResolvedValue(loginResult),
            getProfile: jest.fn().mockResolvedValue(profileResult),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(registerResult);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResult);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with user id', async () => {
      const user = { id: 'user-id' };

      const result = await controller.getProfile(user);

      expect(authService.getProfile).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(profileResult);
    });
  });
});