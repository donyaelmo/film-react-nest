import { ValueTransformer } from 'typeorm';

export const arrayTextTransformer: ValueTransformer = {
  to(value: string[]): string {
    return value.join(',');
  },

  from(value: string): string[] {
    if (!value) {
      return [];
    }

    // Поддержка записей, сохранённых прежним кодом в JSON
    if (value.startsWith('[')) {
      return JSON.parse(value) as string[];
    }

    return value.split(',').map((item) => item.trim());
  },
};
