/* eslint-disable @typescript-eslint/no-explicit-any */
import { TSchema, t } from 'elysia';

import { BadRequestException } from './http-errors';

export function prepareOrderBy(orderByArray: string[], modelKeys: string[]) {
  const orderByInput = orderByArray ?? [];
  const orderBy: { [key: string]: 'asc' | 'desc' }[] = [];

  if (orderByInput.length === 0) {
    orderByInput.push('createdAt:desc');
  }

  orderByInput.forEach((orderByItem) => {
    const [key, value = 'asc'] = orderByItem.split(':');

    if (!modelKeys.includes(key)) {
      throw new BadRequestException('Sıralama özelliği "' + key + '" bulunamadı');
    }

    if (!['asc', 'desc'].includes(value)) {
      throw new BadRequestException('Sıralama yönü "' + key + ':' + value + '" bulunamadı');
    }

    orderBy.push({ [key]: value as 'asc' | 'desc' });
  });

  return orderBy;
}

export function prepareMultipleOptionsFilter<Key extends string, Value>(key: Key, value: Value) {
  if (!value) return undefined;
  const hasFilter = !!value;
  const isFilterArray = hasFilter && Array.isArray(value);
  const valuesArray = hasFilter ? (Array.isArray(value!) ? value! : [value!]) : undefined;
  const valueWhere = hasFilter
    ? isFilterArray
      ? {
          [key]: {
            in: valuesArray!,
          },
        }
      : { [key]: valuesArray![0] }
    : undefined;

  return valueWhere;
}

type WhereDateInput = Date | string | undefined | null;

interface DateWherePayload {
  [key: string]: WhereDateInput;
}

export function prepareDateFilter<
  BeforeDate extends WhereDateInput,
  AfterDate extends WhereDateInput,
>(key: string, beforeDate: BeforeDate, afterDate: AfterDate) {
  const hasFilter = !!afterDate || !!beforeDate;

  const filter = {
    [key]: hasFilter
      ? // @ts-ignore
        afterDate === beforeDate
        ? afterDate
        : {
            gte: afterDate,
            lte: beforeDate,
          }
      : undefined,
  };

  return [hasFilter, filter] as const;
}

export function prepareDateFilters(queryObject: object | null | undefined, keys: string[]) {
  const filters: DateWherePayload[] = [];

  if (queryObject) {
    keys.forEach((key) => {
      // @ts-ignore
      const dateBefore = queryObject[key + 'Before'] as WhereDateInput;
      // @ts-ignore
      const dateAfter = queryObject[key + 'After'] as WhereDateInput;

      const [hasDateFilter, dateFilter] = prepareDateFilter(key, dateBefore, dateAfter);

      if (hasDateFilter) {
        // @ts-ignore
        filters.push(dateFilter);
      }
    });
  }

  const hasFilters = filters.length > 0;
  return [hasFilters, filters] as const;
}

interface FilterKeys {
  simple?: string[] | undefined;
  date?: string[] | undefined;
  multipleOptions?: string[] | undefined;
  search?: string[] | undefined;
  numeric?: string[] | undefined;
  others?: { [key: string]: TSchema } | undefined;
}

export function prepareFiltersDto<T>(dtoObject: T, keys: FilterKeys, addOrderBy = true) {
  const filters: { [key: string]: typeof t.Object } = {};

  {
    keys.simple?.forEach((key) => {
      // @ts-ignore
      const schema = dtoObject.properties[key];
      if (schema) {
        const isBoolean = schema.type === 'boolean';
        if (isBoolean) {
          // @ts-ignore
          filters[key] = t.Optional(
            t
              .Transform(t.Union([t.Boolean(), t.Undefined()]))
              .Decode((value) => (value != null ? JSON.parse(value as unknown as string) : value)) // decode: number to Date
              .Encode((value) => value.toString()),
          );
        } else {
          // @ts-ignore
          filters[key] = t.Optional(schema);
        }
      } else {
        console.error('schema is undefined: ' + key, keys);
      }
    });
  }

  {
    keys.date?.forEach((key) => {
      // @ts-ignore
      const schema = dtoObject.properties[key];

      if (schema) {
        // @ts-ignore
        filters[key + 'Before'] = t.Optional(t.String({ format: 'iso-date-time' }));
        // @ts-ignore
        filters[key + 'After'] = t.Optional(t.String({ format: 'iso-date-time' }));
      } else {
        console.error('schema is undefined: ' + key, keys);
      }
    });
  }

  {
    keys.multipleOptions?.forEach((key) => {
      // @ts-ignore
      const schema = dtoObject.properties[key];

      if (schema) {
        // @ts-ignore
        filters[key] = t.Optional(t.Array(schema));
      } else {
        console.error('schema is undefined: ' + key, keys);
      }
    });
  }

  {
    keys.search?.forEach((key) => {
      // @ts-ignore
      const schema = dtoObject.properties[key];

      if (schema) {
        // @ts-ignore
        filters[key] = t.Optional(schema);
      } else {
        console.error('schema is undefined: ' + key, keys);
      }
    });
  }

  {
    keys.numeric?.forEach((key) => {
      // @ts-ignore
      const schema = dtoObject.properties[key];

      if (schema) {
        // @ts-ignore
        filters[key + 'Lt'] = t.Optional(dtoObject.properties[key]);
        // @ts-ignore
        filters[key + 'Gt'] = t.Optional(dtoObject.properties[key]);
      } else {
        console.error('schema is undefined: ' + key, keys);
      }
    });
  }

  {
    Object.entries(keys.others ?? {}).forEach(([key, schema]) => {
      // @ts-ignore
      filters[key] = t.Optional(schema);
    });
  }

  if (addOrderBy) {
    // @ts-ignore
    filters['orderBy'] = t.Optional(t.Array(t.String()));
  }

  return t.Partial(t.Object(filters as any));
}

export function prepareFiltersQuery(
  queryObject: object | null | undefined,
  keys: FilterKeys,
  addOrderBy: boolean | string[] = true,
) {
  if (!queryObject) return [false, []] as const;

  let hasFilters = false;
  const simpleFilters: { [key: string]: any }[] = [];
  const dateFilters: DateWherePayload[] = [];
  const multipleOptionsFilters: { [key: string]: any }[] = [];
  const searchFilters: { [key: string]: any }[] = [];
  const numericFilters: { [key: string]: any }[] = [];
  const allKeyNames = [
    ...(keys.simple ?? []),
    ...(keys.date ?? []),
    ...(keys.multipleOptions ?? []),
    ...(keys.search ?? []),
    ...(keys.numeric ?? []),
  ];

  {
    keys.simple?.forEach((key) => {
      // @ts-ignore
      const value = queryObject[key];

      if (value != null) {
        hasFilters = true;
        // @ts-ignore
        simpleFilters.push({ [key]: value });
      }
    });
  }

  {
    if (keys.date && keys.date.length > 0) {
      const [hasFiltersLocal, filters] = prepareDateFilters(queryObject, keys.date);

      if (hasFiltersLocal) {
        hasFilters = true;
        dateFilters.push(...filters);
      }
    }
  }

  {
    if (keys.multipleOptions && keys.multipleOptions.length > 0) {
      keys.multipleOptions.forEach((key) => {
        // @ts-ignore
        const value = queryObject[key];

        if (value) {
          const filter = prepareMultipleOptionsFilter(key, value);

          if (filter) {
            hasFilters = true;
            multipleOptionsFilters.push(filter);
          }
        }
      });
    }
  }

  {
    if (keys.search && keys.search.length > 0) {
      keys.search.forEach((key) => {
        // @ts-ignore
        const value = queryObject[key];

        if (value) {
          hasFilters = true;

          searchFilters.push({
            [key]: {
              contains: value.toLocaleUpperCase('tr'),
              mode: 'insensitive',
            },
          });
        }
      });
    }
  }

  {
    if (keys.numeric && keys.numeric.length > 0) {
      keys.numeric.forEach((key) => {
        // @ts-ignore
        const valueGtWhere = queryObject[key + 'Gt'];
        // @ts-ignore
        const valueLtWhere = queryObject[key + 'Lt'];

        if (valueGtWhere || valueLtWhere) {
          hasFilters = true;

          numericFilters.push({
            [key]: {
              ...(valueGtWhere && { gte: valueGtWhere }),
              ...(valueLtWhere && { lte: valueLtWhere }),
            },
          });
        }
      });
    }
  }

  const allFilters = [
    ...simpleFilters,
    ...dateFilters,
    ...multipleOptionsFilters,
    ...searchFilters,
    ...numericFilters,
  ];

  const orderBy = addOrderBy
    ? // @ts-ignore
      prepareOrderBy(queryObject.orderBy, [
        ...allKeyNames,
        ...(Array.isArray(addOrderBy) ? addOrderBy : []),
      ])
    : [];
  const payload = [hasFilters, allFilters, orderBy] as const;

  return payload;
}

function filterJsData<T>(
  queryObject: object | null | undefined,
  keys: FilterKeys,
  data: T[],
  addOrderBy: boolean | string[] = true,
) {
  if (!queryObject) return data;

  const filters: Array<(item: any) => boolean> = [];

  // Simple filters
  keys.simple?.forEach((key) => {
    // @ts-ignore
    const value = queryObject[key];
    if (value != null) {
      filters.push((item: any) => {
        const itemValue = item[key];
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    }
  });

  // Date filters
  keys.date?.forEach((key) => {
    // @ts-ignore
    const beforeKey = `${key}Before`;
    // @ts-ignore
    const afterKey = `${key}After`;
    // @ts-ignore
    const beforeValue = queryObject[beforeKey];
    // @ts-ignore
    const afterValue = queryObject[afterKey];

    if (beforeValue) {
      filters.push((item: any) => {
        const itemDate = new Date(item[key]);
        const compareDate = new Date(beforeValue);
        return itemDate <= compareDate;
      });
    }

    if (afterValue) {
      filters.push((item: any) => {
        const itemDate = new Date(item[key]);
        const compareDate = new Date(afterValue);
        return itemDate >= compareDate;
      });
    }
  });

  // Multiple options filters
  keys.multipleOptions?.forEach((key) => {
    // @ts-ignore
    const value = queryObject[key];
    if (value) {
      const values = Array.isArray(value) ? value : value.split(',');
      filters.push((item: any) => {
        const itemValue = item[key];
        if (Array.isArray(itemValue)) {
          return values.some((v: unknown) => itemValue.includes(v));
        }
        return values.includes(itemValue);
      });
    }
  });

  // Search filters
  keys.search?.forEach((key) => {
    // @ts-ignore
    const value = queryObject[key];
    if (value) {
      filters.push((item: any) => {
        const itemValue = item[key];
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    }
  });

  // Numeric filters
  keys.numeric?.forEach((key) => {
    // @ts-ignore
    const gtValue = queryObject[key + 'Gt'];
    // @ts-ignore
    const ltValue = queryObject[key + 'Lt'];

    if (gtValue) {
      filters.push((item: any) => {
        const itemValue = item[key];
        return typeof itemValue === 'number' && itemValue >= Number(gtValue);
      });
    }

    if (ltValue) {
      filters.push((item: any) => {
        const itemValue = item[key];
        return typeof itemValue === 'number' && itemValue <= Number(ltValue);
      });
    }
  });

  let result = data.filter((item) => filters.every((filter) => filter(item)));

  if (addOrderBy && queryObject && 'orderBy' in queryObject) {
    const allKeyNames = [
      ...(keys.simple ?? []),
      ...(keys.date ?? []),
      ...(keys.multipleOptions ?? []),
      ...(keys.search ?? []),
      ...(keys.numeric ?? []),
      ...(Array.isArray(addOrderBy) ? addOrderBy : []),
    ];

    const orderByRules = prepareOrderBy(
      // @ts-ignore
      queryObject.orderBy,
      allKeyNames,
    );

    if (orderByRules.length > 0) {
      result = result.sort((a, b) => {
        for (const rule of orderByRules) {
          const aValue = (a as any)[rule.field];
          const bValue = (b as any)[rule.field];

          if (aValue === bValue) continue;

          const compareResult = aValue > bValue ? 1 : -1;
          return rule.direction === 'asc' ? compareResult : -compareResult;
        }
        return 0;
      });
    }
  }

  return result;
}

export function prepareFilters<T>(
  dtoObject: T,
  keys: FilterKeys,
  addOrderBy: boolean | string[] = false,
) {
  const filtersDto = prepareFiltersDto(dtoObject, keys, !!addOrderBy);
  const getFiltersQuery = (queryObject: object | null | undefined) =>
    prepareFiltersQuery(queryObject, keys, !!addOrderBy);
  const filterData: <T>(data: T[], queryObject: object | null | undefined) => T[] = (
    data,
    queryObject,
  ) => filterJsData(queryObject, keys, data, !!addOrderBy);

  return [filtersDto as T, getFiltersQuery, filterData] as const;
}
