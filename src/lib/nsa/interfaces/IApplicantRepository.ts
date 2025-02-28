export interface I_ApplicantRepository {
  create(): Promise<object>;
  findAll(): Promise<object[]>;
  findOneById(id: string): Promise<object>;
}
