import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';

export class PaginatorEsp extends MatPaginatorIntl {
    constructor() {
      super();
      this.nextPageLabel = 'Siguiente pagina';
      this.previousPageLabel = 'Pagina anterior';
      this.firstPageLabel = 'Primerpa pagina';
      this.lastPageLabel = 'Ultima pagina'
      this.itemsPerPageLabel = 'Devoluciones por pagina';
    }
}