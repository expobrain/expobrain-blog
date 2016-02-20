---
author: admin
categories: [Guides]
comments: true
date: 2012-05-12 16:53:25
image: {url: /media/2012/05/Google-Android.png}
layout: post
slug: box2d-physics-simulation-on-android
tags: [android, box2d, cocos2d, java, phsysics]
title: Box2D physics simulation on Android
wordpress_id: 849
---

It was a rainy and cold afternoon and I had nothing to do except to play around with Box2D on my Android device. I will show you the another-ball-bouncing example using [Box2D](http://box2d.org/) and [Cocos2D](http://cocos2d.org/).
<!-- more -->
For this example you will need to download these libraries:




  * Cocos2D for Android: you can donwload the source code or the precompiled jar file from the [GitHUB](https://github.com/ZhouWeikuan/cocos2d) repository. In my case I preferred to use the precompiled jat file available under [cocos2d-android/libs](https://github.com/ZhouWeikuan/cocos2d/tree/master/cocos2d-android/libs)


  * JBox2D: it's the java port of the famous [Box2D](http://box2d.org/) library developed by Erin Catto, the project website is hosted [here](http://code.google.com/p/jbox2d/). Unfortunately you need to download the source code and remove or fix manually all the references to `org.apache.log4j` which is not available in the Android SDK.


I'll skip all the tedious steps to create a new Android project (I can find easily millions of how-to on Google) and I'll go straigh to the source code. Firts of all, the activity:



    public final class Android2dActivity extends Activity {
        public static final int TARGET_FPS = 60;

        private CCGLSurfaceView surface;
        private CCScene scene;

        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            requestWindowFeature(Window.FEATURE_NO_TITLE);
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN);
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

            surface = new CCGLSurfaceView(this);

            setContentView(surface);
        }

        @Override
        public void onStart() {
            super.onStart();

            // Attach the OpenGL view to a window
            CCDirector.sharedDirector().attachInView(surface);

            // Show FPS, set false to disable FPS display
            CCDirector.sharedDirector().setDisplayFPS(false);

            // Frames per second
            CCDirector.sharedDirector().setAnimationInterval(1.0f / TARGET_FPS);

            // Make the Scene active
            scene = DroidScene.scene();

            CCDirector.sharedDirector().runWithScene(scene);
        }

        @Override
        public void onPause() {
            super.onPause();

            CCDirector.sharedDirector().pause();
        }

        @Override
        public void onResume() {
            super.onResume();

            CCDirector.sharedDirector().resume();
        }

        @Override
        public void onStop() {
            super.onStop();

            CCDirector.sharedDirector().end();
        }
    }



I'm overriding the [`onCreate()`](http://developer.android.com/reference/android/app/Activity.html#onCreate(android.os.Bundle)) method to set up the application's window (no title, full screen, keep screen on) and create a new Cocos2D surface.

In the [`onStart()`](http://developer.android.com/reference/android/app/Activity.html#onStart()) method I'm finalising the OpenGL surface and attaching the main scene. If you want to see your fps value on the screen just pass `true` to `setDisplayFPS()`; if you want to change the target fps rate change the `TARGET_FPS` constant (the target fps in this example is 60).

The overridden methods [`onPause()`](http://developer.android.com/reference/android/app/Activity.html#onStop()), [`onResume()`](http://developer.android.com/reference/android/app/Activity.html#onResume()) and [`onStop()`](http://developer.android.com/reference/android/app/Activity.html#onStop()) just calls the respective [`CCDirector`](http://www.cocos2d-iphone.org/api-ref/0.99.5/interface_c_c_director.html)'s `pause()`, `resume()` and `end()` methods.

The main (and only one) scene is trivial:



    public final class MainScene extends CCLayer {
        public static CCScene scene() {
            /*
             * Create the scene for this layer
             */
            CCScene scene = CCScene.node();

            scene.addChild(new MainLayer());

            return scene;
        }
    }



Nothing here needs to be explained :).

And now the interesting part: the main sceene's layer where all the magic happens. I'll explaining it step by step starting from some constant's declarations:



    public final class MainLayer extends CCLayer {
        private static final float TIMESTEP = 1.0f / Android2dActivity.TARGET_FPS;
        private static final int VELOCITY_ITERATIONS = 10;
        private static final int POSITION_ITERATIONS = 10;
        private static final Vec2 DEFAULT_GRAVITY = new Vec2(0.0f, 0.0f);
        private static final boolean ALLOW_SLEEP = false;
        private static final float SCREEN_TO_WORLD_RATIO = 2000.0f;

        private static final String SMILE_FILENAME = "smile.png";
        private static final float SMILE_RADIUS = 26.0f / SCREEN_TO_WORLD_RATIO;
        private static final float SMILE_DENSITY = 0.25f;
        private static final float SMILE_FRICTION = 0.1f;
        private static final float SMILE_RESTITUTION = 0.7f;

        private static final int BODY_COUNT = 20;

        public World world;



In the first part I'm setting some physics simulator's parameters, you can find the meaning of those parameters in the Box2D documentation. However I'll explaining some of these because they are important to understand how the example works:




  * `TIMESTEP` is the time delta in millisecond used by Box2D to simulate the world's physics, it's set as 1/60th of second. To understand the importance of the timestep in physics simulation read this post [Fix your Timestep!](http://gafferongames.com/game-physics/fix-your-timestep/)


  * `DEFAULT_GRAVITY` is zero when the simultation starts because it'll be updated by the reading from the device's accellerometer


  * `ALLOW_SLEEP` usually is set to `true` to allow Box2D to ignore the simulatio on objects in a rest state; because I'm changing the gravity during the simulation I'm setting it to `false` to continuosly simulate the position of the objects


  * `SCREEN_TO_WORLD_RATIO` translate the screen coordinates into physical coordinates; in this example the scale is 2000px/1meter


The second pars defines the ball's sprite and some physical properties. The simulated ball will have a radius of 1.3 centimeters (26(px) / 2000(px/m) = 0.013(m))
The last section defines how many bodies I'm putting on the screen for a mor funny simulation.



        public MainLayer() {
            // Setup world and body
            setUpWorld();
            setUpBodies();

            // Set up layer
            setIsAccelerometerEnabled(true);

            // Schedule the physics simulation
            schedule("tick");
        }



In the layer's constructor I set up the world and the simulated bodies, enabling the device's accellerometer and schedule the callback to run the simulation a every frame.



        private void setUpWorld() {
            // Set up world
            world = new World(DEFAULT_GRAVITY, ALLOW_SLEEP);

            // Get screen corners
            CGSize size = CCDirector.sharedDirector().winSize();

            Vec2 upperLeft = screenToWorld(0, size.height);
            Vec2 upperRight = screenToWorld(size.width, size.height);
            Vec2 lowerLeft = screenToWorld(0, 0);
            Vec2 lowerRight = screenToWorld(size.width, 0);

            // Set up walls body definitions
            BodyDef leftDef = new BodyDef();
            BodyDef rightDef = new BodyDef();
            BodyDef topDef = new BodyDef();
            BodyDef bottomDef = new BodyDef();

            leftDef.position.set(lowerLeft);
            rightDef.position.set(lowerRight);
            topDef.position.set(upperLeft);
            bottomDef.position.set(lowerLeft);

            // Set up wall shapes
            PolygonShape leftShape = new PolygonShape();
            PolygonShape rightShape = new PolygonShape();
            PolygonShape topShape = new PolygonShape();
            PolygonShape bottomShape = new PolygonShape();

            leftShape.setAsEdge(lowerLeft, upperLeft);
            rightShape.setAsEdge(lowerRight, upperRight);
            topShape.setAsEdge(upperLeft, upperRight);
            bottomShape.setAsEdge(lowerLeft, lowerRight);

            // Setup up world box body
            Body boxBody = world.createBody(bottomDef);

            boxBody.createFixture(leftShape, 0.0f);
            boxBody.createFixture(rightShape, 0.0f);
            boxBody.createFixture(topShape, 0.0f);
            boxBody.createFixture(bottomShape, 0.0f);
        }



The world's setup creates a box around the screen's edge so our bodies will not escape outside the screen.



        private void setUpBodies() {
            // Get start position
            CGSize size = CCDirector.sharedDirector().winSize();
            CGPoint pos = CGPoint.make(size.width / 2, size.height / 2);

            for (int i = 0; i < BODY_COUNT; i++) {
                // Create Dynamic Body
                BodyDef bodyDef = new BodyDef();

                bodyDef.type = BodyType.DYNAMIC;
                bodyDef.position.set(screenToWorld(pos));

                final Body smileBody = world.createBody(bodyDef);

                // Create Shape
                CircleShape smileShape = new CircleShape();

                smileShape.m_radius = SMILE_RADIUS;

                // Create fixture
                FixtureDef smileFixture = new FixtureDef();

                smileFixture.shape = smileShape;
                smileFixture.density = SMILE_DENSITY;
                smileFixture.friction = SMILE_FRICTION;
                smileFixture.restitution = SMILE_RESTITUTION;

                // Assign fixture to Body
                smileBody.createFixture(smileFixture);

                // Set sprite
                final CCSprite smileSprite = CCSprite.sprite(SMILE_FILENAME);

                smileSprite.setPosition(pos);

                addChild(smileSprite, 0);

                smileBody.setUserData(smileSprite);
            }
        }



All the bodies are created on the center of the screen with the physical attributes I defined before. For every body I'm attaching a new smile's sprite by the `setUserData()` method; this way I can retrieve and update the sprite's later during the physics simulation's step.



        public void tick(float dt) {
            // Update Physics World
            synchronized (world) {
                world.step(TIMESTEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
            }

            // Update sprites
            for (Body b = world.getBodyList(); b != null; b = b.getNext()) {
                CCSprite sprite = (CCSprite) b.getUserData();

                if (sprite != null) {
                    sprite.setRotation(-(float) Math.toDegrees(b.getAngle()));
                    sprite.setPosition(worldToScreen(b.getPosition()));
                }
            }
        }



For every frame I'm simulate the world's physics in the given timestep and update the sprite position and rotation for every body which has a sprite attached. As you'd noticed I'm wrapping the `step()` into a `synchronized` statement, that because, as shown in the next code snipet, I'm updating the worlds gravity by the accellerometer's change event. If the update happens during the simulation step the result of the simulation can be inprecise or, in the worst case, corrupt the world's state (the real world is corrupted enough, we don't need to corrupt our virtual world too :-D).



        public void ccAccelerometerChanged(float x, float y, float z) {
            synchronized (world) {
                world.setGravity(new Vec2(-x, -y));
            }
        }



Setting the gravity is trivial, just remember it's a force which points down so I'm inverting the sign of the accellerometer's values. As described before, the `setGravity()` method is wrapped in a `synchronized` to avoid concurrent access to the world instance.



        private CGPoint worldToScreen(final Vec2 coord) {
            return CGPoint.make(coord.x * SCREEN_TO_WORLD_RATIO, coord.y
                    * SCREEN_TO_WORLD_RATIO);
        }

        private Vec2 screenToWorld(final CGPoint coord) {
            return screenToWorld(coord.x, coord.y);
        }

        private Vec2 screenToWorld(final float x, final float y) {
            return new Vec2(x / SCREEN_TO_WORLD_RATIO, y / SCREEN_TO_WORLD_RATIO);
        }
    }



We close the class deifnition with some helpful methods to convert screen coordinates to world coordinates and vice versa.

I'm going to rotate the device so I need to fix the screen orientation; in the AndroidManifest.xml I'm setting a portrait orientation:



    <activity android:name=".Android2dActivity" android:screenorientation="portrait">



That's all. If you want to play with this example just download the source code from [here]({{ site.url }}/media/2012/05/android2d.tar.gz).

Enjoy it!
