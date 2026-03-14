> Este archivo sirve como ejemplo de cómo debe estar estructurado el archivo `insumos-emergencia.md` ubicado en la raíz del proyecto. El archivo servirá para que un agente de IA cree `db.json` a partir de la información que se le proporcione.

---

## Símbolos

| Símbolo   | Significado               |
| --------- | ------------------------- |
| `V`       | Ya vencido                |
| `*`       | Vence este año (2026)     |
| `R`       | Reponer                   |
| `PS`      | Pronto a sacar (inferido) |
| _(vacío)_ | Vence en 2027 o posterior |

## Categorías

- alimentos
- especias
- bebidas
- higiene
- otros

## Alimentos

| Producto                       | Cantidad / Presentación | Vencimiento | Calorías (kcal) por porción | Proteína (g) por porción | Notas | Categoría |
| ------------------------------ | ----------------------- | ----------- | --------------------------- | ------------------------ | ----- | --------- |
| Ramen Roland `*`               | 85 g                    | 2026/06     | 400                         | 7                        | --    | Alimento  |
| Ramen MAMA `R`                 | --                      | --          | --                          | --                       | --    | Alimento  |
| Salsa de soya sabor Hongos `*` | 4x 500 ml               | 2026/05     | --                          | --                       | --    | Alimento  |
| Ajo granulado `*`              | 50 g                    | 2026/10     | --                          | --                       | --    | Especia   |
| Paprika `PS`                   | --                      | --          | --                          | --                       | --    | Especia   |
| Salsa de tomate Marinara `*`   | 652 g                   | 2026/11     | 60                          | 2                        | --    | Alimento  |
| Lata SoyaPac bife `PS` `*`     | 350 g                   | 2026/10     | 170                         | 29                       | --    | Alimento  |
| Aplicadores de madera          | 100 piezas              |             | --                          | --                       | --    | Higiene   |
