

export class BrewService {

  static scope = 'scoped'
  constructor(brewModel){
    this.brewModel = brewModel
  }
  getAll(method, ratingMin) {
    return this.brewModel.get(method,ratingMin);
  }

  getOne(id) {
    const brew = this.brewModel.find(id);
    if (!brew) throw Object.assign(new Error('User not found'), { status: 404 });
    return brew;
  }

  create(body) {
    return this.brewModel.create(body);
  }

  async update(id, body) {
    const newBrew = await this.brewModel.update(id, body)
    if (!newBrew) throw Object.assign(new Error('User not found'), { status: 404 });
    return newBrew;
  }

  delete(id) {
    if (!this.brewModel.remove(id))
      throw Object.assign(new Error('User not found'), { status: 404 });
  }
}