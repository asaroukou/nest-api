import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Root,
  InputType,
  Field,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Post, } from '../post/post.type'
import { User } from './user.type'
import { UserService } from './user.service'
import { PostInput } from '../post/post.resolver'


@InputType()
class UserCreateInput {
  @Field()
  email: string

  @Field()
  imageUrl: string

  @Field({ nullable: true })
  username: string

  @Field((type) => [PostInput], { nullable: true })
  posts: [PostInput]
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) { }

  

  @Mutation((returns) => User)
  async createUser(
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {
    const postData = data.posts?.map((post) => {
      const slug = post.title.replace(' ', '-')
      return { title: post.title, imageUrl: post.imageUrl, slug: slug, content: post.content || undefined }
    })

    return this.userService.createUser({
      email: data.email,
      username: data.username,
      imageUrl: data.imageUrl,
      posts: {
        create: postData
      }
    })
  }

  @Query((returns) => [User], { nullable: true })
  async allUsers(@Context() ctx) {
    return this.userService.users({})
  }

  @ResolveField()
  posts(@Root() user: User, @Context() ctx): Promise<Post[]> {
    return this.userService.userPosts({
      id: user.id,
    })
  }

}