import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []
    
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at ? new Date(data.validated_at) : null
        }

        this.items.push(checkIn)

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')
        
        const checkInOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at)
            const isCheckInOnSameDay = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
            
            return checkIn.user_id === userId && isCheckInOnSameDay
        })

        if(!checkInOnSameDate) return null

        return checkInOnSameDate
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.items
            .filter(item => item.user_id === userId)
            .slice((page - 1) * 20, page * 20)
    }

    async countByUserId(userId: string): Promise<number> {
        return this.items.filter(item => item.user_id === userId).length
    }

    async findById(checkInId: string): Promise<CheckIn | null> {
        const checkIn = this.items.find(item => item.id === checkInId)

        if (!checkIn) return null
        
        return checkIn
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.items.findIndex(item => item.id === checkIn.id)

        if (checkInIndex >= 0) this.items[checkInIndex] = checkIn
        
        return checkIn
    }
}