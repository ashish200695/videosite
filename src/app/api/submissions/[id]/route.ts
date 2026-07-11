import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

function getAuthUserId(req: NextRequest): string | null {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        contributor: {
          select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            revenueShare: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const { action, rejectionReason, dailymotionVideoId } = await req.json();

    if (action === 'approve') {
      if (!dailymotionVideoId) {
        return NextResponse.json(
          { error: 'Dailymotion video ID required for approval' },
          { status: 400 }
        );
      }

      // Create story from submission
      const story = await prisma.story.create({
        data: {
          title: submission.title,
          description: submission.description,
          category: submission.category,
          tags: submission.tags,
          thumbnailUrl: submission.thumbnailUrl,
          dailymotionVideoId,
          dailymotionEmbedCode: `<iframe width="560" height="315" src="https://www.dailymotion.com/embed/video/${dailymotionVideoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`,
          contributorId: submission.contributorId,
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      // Update submission status
      const updated = await prisma.submission.update({
        where: { id: params.id },
        data: {
          status: 'APPROVED',
          storyId: story.id,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json(updated);
    } else if (action === 'reject') {
      const updated = await prisma.submission.update({
        where: { id: params.id },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'No reason provided',
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json(updated);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
