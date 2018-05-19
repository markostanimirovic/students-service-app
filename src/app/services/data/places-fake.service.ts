export class PlacesFakeService {
  private places: string[];

  constructor() {
    this.places = [
      'Beograd', 'Novi Sad', 'Niš', 'Leskovac', 'Jagodina', 'Smederevo', 'Paraćin', 'Vranje', 'Sombor', 'Zrenjanin', 'Šabac',
      'Kosovska Mitrovica', 'Prizren', 'Priština', 'Aranđelovac', 'Mladenovac', 'Loznica', 'Negotin', 'Zaječar', 'Stara Pazova'
    ];
  }

  getAll(): string[] {
    return this.places.slice();
  }

  get(index: number) {
    return this.places[index];
  }

  addIfNotExist(places: string[]) {
    places.forEach((place) => (this.places.indexOf(place) < 0) ? this.places.push(place) : null);
  }

}
