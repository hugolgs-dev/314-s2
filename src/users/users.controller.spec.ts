import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  /**************************** Pour la fonction create() ****************************/

  describe('create', () => {
    /** Pour le use case OK **/
    it('On ajoute un utilisateur (use case OK)', async () => {
      const newUser: CreateUserDto = {
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
      };
      const user: User = {
        id: 10,
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockReturnValue(user);

      const result = await controller.create(newUser);
      expect(result).toHaveProperty('firstName', 'firstNameOK');
      expect(result).toHaveProperty('lastName', 'lastNameOK');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.id).toBeDefined();
    });
    /** Pour le use case KO **/
    it("Si les données générées pendant la création d'un utilisateur sont invalides (use case KO)", async () => {
      const newInvalidUser: CreateUserDto = {
        firstName: '',
        lastName: '',
      };
      mockUsersService.create.mockRejectedValue(
        new Error('Erreur dans la base de données.'),
      );
      await expect(controller.create(newInvalidUser)).rejects.toThrow(
        'Erreur dans la base de données.',
      );
    });
  });

  /**************************** Pour la fonction findAll() ****************************/

  describe('findAll', () => {
    /** Pour le use case OK **/
    it("On accède à un tableau d'utilisateurs présents (use case OK)", async () => {
      const result = await controller.findAll();
      mockUsersService.findAll.mockReturnValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      mockUsersService.findAll.mockRejectedValue(
        new Error('Erreur dans la base de données'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Erreur dans la base de données',
      );
    });
  });

  /**************************** Pour la fonction findOne() ****************************/

  describe('findOne', () => {
    /** Pour le use case OK **/
    it('On retourne un utilisateur unique (use case OK)', async () => {
      const userReturned = {
        id: 10,
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
      };
      mockUsersService.findOne.mockReturnValue(userReturned);
      expect(await controller.findOne(10)).toEqual(userReturned);
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('Utilisateur non trouvé'),
      );
      await expect(controller.findOne(10)).rejects.toThrow(
        'Utilisateur non trouvé',
      );
    });
  });

  /**************************** Pour la fonction update() ****************************/

  describe('update', () => {
    /** Pour le use case OK **/
    it('On met à jour un utilisateur (use case OK)', async () => {
      const updatedUser: UpdateUserDto = {
        firstName: 'updatedFirstNameOK',
        lastName: 'updatedLastNameOK',
      };
      const result = {
        id: 10,
        firstName: 'updatedFirstNameOK',
        lastName: 'updatedLastNameOK',
      };
      mockUsersService.update.mockReturnValue(result);
      expect(await controller.update(10, updatedUser)).toEqual(result);
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      const updatedUser: UpdateUserDto = {
        firstName: 'updatedFirstNameOK',
        lastName: 'updatedLastNameOK',
      };
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('Utilisateur non trouvé'),
      );
      await expect(controller.update(999, updatedUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /**************************** Pour la fonction delete() ****************************/

  describe('delete', () => {
    /** Pour le use case OK **/
    it('On supprime un utilisateur (use case OK)', async () => {
      mockUsersService.delete.mockResolvedValue(undefined);

      expect(await controller.delete(10)).toBeUndefined();
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      mockUsersService.delete.mockRejectedValue(
        new NotFoundException('Utilisateur non trouvé'),
      );

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
