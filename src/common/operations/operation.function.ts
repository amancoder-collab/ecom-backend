import { Injectable } from "@nestjs/common";

@Injectable()
export class Operation {
    public calculatePagination(page: number, limit: number) {
        const correctedPage = Math.max(1, page);
        const correctedLimit = Math.min(Math.max(1, limit), 100);
        const skip = (correctedPage - 1) * correctedLimit;
        const take = correctedLimit;
        return { skip, take };
    }

    public calculatePaginationOptimized(page: number, limit: number) {
        const skip =
            (Math.max(1, page) - 1) * Math.min(Math.max(1, limit), 100);
        return { skip, take: skip / (page - 1) };
    }
}
