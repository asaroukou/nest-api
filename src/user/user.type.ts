import 'reflect-metadata'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Post } from '../post/post.type'

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number

  @Field()
  @IsEmail()
  email: string

  @Field((type) => String, { nullable: true })
  imageUrl: string | null

  @Field((type) => String, { nullable: true })
  username?: string | null

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null
}