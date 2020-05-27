"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let ProducerEntity = /** @class */ (() => {
    let ProducerEntity = class ProducerEntity extends typeorm_1.BaseEntity {
    };
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn({ comment: '唯一id' }),
        tslib_1.__metadata("design:type", Number)
    ], ProducerEntity.prototype, "id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ comment: '消息key', unique: true }),
        tslib_1.__metadata("design:type", String)
    ], ProducerEntity.prototype, "message_key", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ comment: '本地事务状态', default: false }),
        tslib_1.__metadata("design:type", Boolean)
    ], ProducerEntity.prototype, "status", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ comment: '创建时间', nullable: true }),
        tslib_1.__metadata("design:type", Date)
    ], ProducerEntity.prototype, "createdAt", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ comment: '更新时间', nullable: true }),
        tslib_1.__metadata("design:type", Date)
    ], ProducerEntity.prototype, "updatedAt", void 0);
    ProducerEntity = tslib_1.__decorate([
        typeorm_1.Entity('producer')
    ], ProducerEntity);
    return ProducerEntity;
})();
exports.ProducerEntity = ProducerEntity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9kdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEscUNBQTZFO0FBRzdFO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLG9CQUFVO0tBaUI3QyxDQUFBO0lBZEc7UUFEQyxnQ0FBc0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQzs7OENBQ2pDO0lBR1g7UUFEQyxnQkFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7O3VEQUN2QjtJQUdwQjtRQURDLGdCQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQzs7a0RBQzlCO0lBR2hCO1FBREMsZ0JBQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzBDQUNqQyxJQUFJO3FEQUFDO0lBR2hCO1FBREMsZ0JBQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzBDQUNqQyxJQUFJO3FEQUFDO0lBZlAsY0FBYztRQUQxQixnQkFBTSxDQUFDLFVBQVUsQ0FBQztPQUNOLGNBQWMsQ0FpQjFCO0lBQUQscUJBQUM7S0FBQTtBQWpCWSx3Q0FBYyJ9