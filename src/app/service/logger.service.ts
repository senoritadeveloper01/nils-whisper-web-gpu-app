import { format } from 'date-fns';
import packageJson from '../../../package.json';

export class LoggerService {
  public static logInfo(info: string | string[]): void {
    const infoMessages = Array.isArray(info) ? info : [info];
    console.log(
      `%c${packageJson.name} - v${packageJson.version}`,
      'color:#00a0df;border:1px solid #00a0df;padding:1px 2px;border-radius: 2px',
      `[${format(Date.now(), 'dd/MM/yyyy HH:mm:ss')}]`,
      ...infoMessages
    );
  }

  public static logError(error: string | string[]): void {
    const errorMessages = Array.isArray(error) ? error : [error];
    console.error(
      `%c${packageJson.name} - v${packageJson.version}`,
      'color:#f05f6d;border:1px solid #f05f6d;padding:1px 2px;border-radius: 2px',
      `[${format(Date.now(), 'dd/MM/yyyy HH:mm:ss')}]`,
      ...errorMessages
    );
  }
}
