import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async auth(req: Request) {
        try {
            // @ts-ignore
            const profile = req.user?.profile

            const profileId = profile.id?.toString()

            const photos = profile.photos
            let image: string = null

            if (photos.length > 0) {
                image = photos[0]?.value
            }

            let user = await this.prisma.user.findUnique({
                where: { profileId }
            })

            if (user && (
                user.avatar !== image ||
                user.username !== profile.username ||
                user.displayName !== profile.displayName
            )) {
                await this.prisma.user.update({
                    where: { profileId },
                    data: {
                        avatar: image,
                        username: profile.username,
                        displayName: profile.displayName,
                    }
                })
            }

            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        avatar: image,
                        profileId: profileId,
                        username: profile.username,
                        displayName: profile.displayName,
                    }
                })
            }

            const payload = { username: user.username, sub: user.id, profileId }
            const token = await this.jwtService.signAsync(payload)

            return { user, token }
        } catch (err) {
            console.error(err)
        }
    }
}
