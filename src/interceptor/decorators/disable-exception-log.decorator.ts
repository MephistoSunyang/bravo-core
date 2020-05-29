import { SetMetadata } from '@nestjs/common';

export const DisableExceptionLog = () => SetMetadata('disableExceptionLogEnable', true);
