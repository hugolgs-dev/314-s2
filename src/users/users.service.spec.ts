import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
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
        id: 11,
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(newUser);
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
      mockUserRepository.create.mockImplementation(() => {
        throw new Error("Erreur lors de la création de l'utilisateur");
      });
      await expect(service.create(newInvalidUser)).rejects.toThrow(
        "Erreur lors de la création de l'utilisateur",
      );
    });
  });
  /**************************** Pour la fonction findAll() ****************************/
  describe('findAll', () => {
    it("On accède à un tableau d'utilisateurs présents (use case OK)", async () => {
      const users = [
        { id: 1, firstName: 'firstName1', lastName: 'lastName2' },
        { id: 2, firstName: 'firstName2', lastName: 'lastName2' },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });

    it('Lance une erreur NotFoundException (use case KO)', async () => {
      mockUserRepository.find.mockRejectedValue(
        new Error('Erreur dans la base de données'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Erreur dans la base de données',
      );
    });
  });

  /**************************** Pour la fonction findOne() ****************************/

  describe('findOne', () => {
    /** Pour le use case OK **/
    it('On retourne un utilisateur unique (use case OK)', async () => {
      const userReturned = {
        id: 11,
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
      };
      mockUserRepository.findOne.mockResolvedValue(userReturned);

      expect(await service.findOne(11)).toEqual(userReturned);
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      const userId = 999;
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(`L'utilisateur avec l'ID ${userId} n'a pas été trouvé`),
      );
    });
  });
  /**************************** Pour la fonction update() ****************************/

  describe('update', () => {
    /** Pour le use case OK **/
    it('On met à jour un utilisateur (use case OK)', async () => {
      const existingUser = {
        id: 11,
        firstName: 'firstNameOK',
        lastName: 'lastNameOK',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedUser: UpdateUserDto = {
        firstName: 'updatedFirstNameOK',
        lastName: 'updatedLastNameOK',
      };

      const savedUser = { ...existingUser, ...updatedUser };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(savedUser);
      expect(await service.update(11, updatedUser)).toEqual(savedUser);
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      const updatedUser: UpdateUserDto = {
        firstName: 'updatedFirstNameOK',
        lastName: 'updatedLastNameOK',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, updatedUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  /**************************** Pour la fonction delete() ****************************/
  describe('delete', () => {
    /** Pour le use case OK **/
    it('On supprime un utilisateur (use case OK)', async () => {
      const user = { id: 11, firstName: 'firstNameOK', lastName: 'lastNameOK' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete(11)).resolves.toBeUndefined();
    });
    /** Pour le use case KO **/
    it('Lance une erreur NotFoundException (use case KO)', async () => {
      const userId = 999;
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.delete(userId)).rejects.toThrow(
        new NotFoundException(
          `L'utilisateur avec l'ID ${userId} n'a pas été trouvé`,
        ),
      );
    });
  });
});
