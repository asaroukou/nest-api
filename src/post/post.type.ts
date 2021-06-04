import 'reflect-metadata'
import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { User } from '../user/user.type'

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date

  @Field()
  title: string

  @Field()
  slug: string

  @Field((type) => String, { nullable: true })
  imageUrl: string | null

  @Field((type) => String, { nullable: true })
  content: string | null

  @Field((type) => Boolean, { nullable: true })
  published?: boolean | null

  @Field((type) => Boolean, { nullable: true })
  archived?: boolean | null

  @Field((type) => User, { nullable: true })
  author?: User | null
}