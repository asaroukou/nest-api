import 'reflect-metadata'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Root,
  Context,
  Int,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Post } from './post.type'
import { User } from '../user/user.type'
import { UserService } from '../user/user.service'
import { PostService } from '../post/post.service'
import { PrismaService } from '../prisma/prisma.service'

@InputType()
export class PostInput {
  @Field()
  title: string

  @Field({ nullable: true })
  imageUrl: string

  @Field({ nullable: true })
  published: boolean


  @Field({ nullable: true })
  content: string
}

@InputType()
class PostOrderByUpdatedAtInput {
  @Field((type) => SortOrder)
  updatedAt: SortOrder
}

enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}

registerEnumType(SortOrder, {
  name: 'SortOrder'
})

@Resolver(Post)
export class PostResolver {
  constructor(@Inject(PostService) private postService: PostService) { }

  @Query((returns) => [Post])
  allPost(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
    @Args('orderBy', { nullable: true }) orderBy: PostOrderByUpdatedAtInput,
    @Context() ctx) {
    return this.postService.posts({
      where: {
        published: true,
      },
      take: take || undefined,
      skip: skip || undefined,
      orderBy: orderBy || undefined,
    })
  }

  @Query((returns) => Post, { nullable: true })
  postById(@Args('id') id: number) {
    return this.postService.post({
      id: id
    })
  }

  @Mutation((returns) => Post)
  setPublishState(@Args('id') id: number, @Args('state') state: boolean) {
    return this.postService.updatePost({
      data: { published: state },
      where: { id },
    })
  }

  @Mutation((returns) => Post)
  setArchivedState(@Args('id') id: number, @Args('state') state: boolean) {
    return this.postService.updatePost({
      data: { archived: state },
      where: { id },
    })
  }

  @Mutation((returns) => Post)
  createPost(
    @Args('data') data: PostInput,
    @Args('authorEmail') authorEmail: string,
    @Context() ctx,
  ): Promise<Post> {
    const slug = data.title.replace(' ', '-')
    const postData = {
      title: data.title,
      content: data.content,
      slug: slug,
      imageUrl: data.imageUrl,
      published: data.published || false,
      author: {
        connect: { email: authorEmail },
      },
    }
    return this.postService.createPost(postData)
  }

  @Mutation((returns) => Post)
  updatePost(
    @Args('id') id: number,
    @Args('data') data: PostInput,
    @Args('authorEmail') authorEmail: string,
    @Context() ctx,
  ): Promise<Post> {
    const slug = data.title.replace(' ', '-')
    return this.postService.updatePost({
      data: {
        title: data.title,
        content: data.content,
        slug: slug,
        imageUrl: data.imageUrl,
        published: data.published || false,
        author: {
          connect: { email: authorEmail },
        },
      },
      where:{id: id}
    })
  }

  @Mutation((returns) => Post, { nullable: true })
  async deletePost(
    @Args('id') id: number,
    @Context() ctx,
  ): Promise<Post | null> {
    return this.postService.deletePost({
        id: id,
    })
  }

  @ResolveField()
  author(@Root() post: Post): Promise<User | null> {
    return this.postService.postAuthor
      ({  id: post.id})
  }


  
}