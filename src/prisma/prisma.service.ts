import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    //create a database connetion on module init
    async onModuleInit() {
        await this.$connect();
    }
    
    //close the connetion once the module is destroyed
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
