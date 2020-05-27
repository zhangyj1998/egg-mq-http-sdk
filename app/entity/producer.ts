import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('producer')
export class ProducerEntity extends BaseEntity {

    @PrimaryGeneratedColumn({ comment: '唯一id' })
    id: number;

    @Column({ comment: '消息key', unique: true })
    message_key: string;

    @Column({ comment: '本地事务状态', default: false })
    status: boolean;

    @Column({ comment: '创建时间', nullable: true })
    createdAt: Date;

    @Column({ comment: '更新时间', nullable: true })
    updatedAt: Date;

}